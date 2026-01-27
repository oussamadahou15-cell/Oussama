const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// إنشاء مجلد للملفات
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// إعداد قاعدة البيانات
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Database connected successfully!');
    initDatabase();
  }
});

// إنشاء الجداول
function initDatabase() {
  db.run(`CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    lessonCount INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    fileName TEXT NOT NULL,
    fileUrl TEXT NOT NULL,
    fileSize INTEGER,
    subjectId INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subjectId) REFERENCES subjects(id)
  )`);
}

// إعداد Multer لرفع الملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

// ==================== API Routes ====================

// الصفحة الرئيسية
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// الحصول على جميع المقاييس
app.get('/api/subjects', (req, res) => {
  db.all('SELECT * FROM subjects ORDER BY name', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// إضافة مقياس جديد
app.post('/api/subjects', (req, res) => {
  const { name, icon } = req.body;
  
  if (!name || !icon) {
    return res.status(400).json({ error: 'Name and icon are required' });
  }

  db.run(
    'INSERT INTO subjects (name, icon, lessonCount) VALUES (?, ?, 0)',
    [name, icon],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, name, icon, lessonCount: 0 });
      }
    }
  );
});

// حذف مقياس
app.delete('/api/subjects/:id', (req, res) => {
  const id = req.params.id;

  // حذف جميع الدروس المرتبطة أولاً
  db.all('SELECT * FROM lessons WHERE subjectId = ?', [id], (err, lessons) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // حذف ملفات الدروس
    lessons.forEach(lesson => {
      const filePath = path.join(__dirname, 'uploads', lesson.fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // حذف الدروس من قاعدة البيانات
    db.run('DELETE FROM lessons WHERE subjectId = ?', [id], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // حذف المقياس
      db.run('DELETE FROM subjects WHERE id = ?', [id], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json({ message: 'Subject deleted successfully' });
        }
      });
    });
  });
});

// الحصول على دروس مقياس معين
app.get('/api/lessons/:subjectId', (req, res) => {
  const subjectId = req.params.subjectId;

  db.all(
    'SELECT * FROM lessons WHERE subjectId = ? ORDER BY createdAt DESC',
    [subjectId],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    }
  );
});

// رفع درس جديد
app.post('/api/lessons', upload.single('file'), (req, res) => {
  const { title, subjectId } = req.body;
  const file = req.file;

  if (!title || !subjectId || !file) {
    return res.status(400).json({ error: 'Title, subjectId, and file are required' });
  }

  const fileUrl = `/uploads/${file.filename}`;
  const fileSize = file.size;

  db.run(
    'INSERT INTO lessons (title, fileName, fileUrl, fileSize, subjectId) VALUES (?, ?, ?, ?, ?)',
    [title, file.filename, fileUrl, fileSize, subjectId],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        // تحديث عداد الدروس
        db.run(
          'UPDATE subjects SET lessonCount = lessonCount + 1 WHERE id = ?',
          [subjectId],
          (err) => {
            if (err) {
              console.error('Error updating lesson count:', err);
            }
          }
        );

        res.json({
          id: this.lastID,
          title,
          fileName: file.filename,
          fileUrl,
          fileSize,
          subjectId
        });
      }
    }
  );
});

// حذف درس
app.delete('/api/lessons/:id', (req, res) => {
  const id = req.params.id;

  // الحصول على معلومات الدرس أولاً
  db.get('SELECT * FROM lessons WHERE id = ?', [id], (err, lesson) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // حذف الملف
    const filePath = path.join(__dirname, 'uploads', lesson.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // حذف الدرس من قاعدة البيانات
    db.run('DELETE FROM lessons WHERE id = ?', [id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        // تحديث عداد الدروس
        db.run(
          'UPDATE subjects SET lessonCount = lessonCount - 1 WHERE id = ?',
          [lesson.subjectId],
          (err) => {
            if (err) {
              console.error('Error updating lesson count:', err);
            }
          }
        );

        res.json({ message: 'Lesson deleted successfully' });
      }
    });
  });
});

// بدء السيرفر
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 Access the app at: http://localhost:${PORT}`);
});
