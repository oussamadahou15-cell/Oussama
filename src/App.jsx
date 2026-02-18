import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import { authService, postsService } from "./lib/supabase";

// ══════════════════════════════════════════════════════════════
// TRANSLATIONS (inline for self-contained component)
// ══════════════════════════════════════════════════════════════
const TRANSLATIONS = {
  ar: {
    dir:"rtl", flag:"🇸🇦", label:"العربية",
    appName:"UniConnect", appTagline:"شبكتك الأكاديمية الذكية",
    login:"تسجيل الدخول", register:"إنشاء حساب", logout:"تسجيل الخروج",
    email:"البريد الإلكتروني الجامعي", emailPh:"your@university.edu.sa",
    password:"كلمة المرور", passwordPh:"8 أحرف على الأقل",
    forgotPw:"نسيت كلمة المرور؟", noAccount:"ليس لديك حساب؟", haveAccount:"لديك حساب بالفعل؟",
    welcomeBack:"مرحباً بعودتك 👋", loginSub:"سجّل دخولك للوصول لشبكتك الأكاديمية",
    loggingIn:"جاري التحقق...", creatingAcc:"جاري إنشاء حسابك...",
    step1Title:"معلوماتك الشخصية", step1Sub:"الخطوة 1 من 2",
    step2Title:"معلوماتك الأكاديمية", step2Sub:"الخطوة 2 من 2",
    firstName:"الاسم الأول", lastName:"الاسم الأخير", username:"اسم المستخدم",
    university:"اسم الجامعة", faculty:"الكلية / القسم",
    youAre:"أنت", student:"طالب", professor:"أستاذ", researcher:"باحث",
    createAcc:"إنشاء الحساب 🎉", nextBtn:"التالي →",
    f1:"تواصل مع زملائك وأساتذتك", f2:"شارك ملفاتك الأكاديمية",
    f3:"تعلّم باستخدام AI Assistant", f4:"انضم لمجموعات دراسية",
    navHome:"الرئيسية", navConn:"اتصالاتي", navLib:"المكتبة",
    navMsg:"الرسائل", navGroups:"المجموعات", navAI:"AI Assistant", navSettings:"الإعدادات",
    posts:"منشور", files:"ملف", connections:"اتصال",
    postPh:"شارك شيئاً أكاديمياً،", uploadFile:"رفع ملف", discussion:"نقاش", achievement:"إنجاز",
    publishNow:"نشر الآن 🚀", publishTo:"النشر لـ",
    public:"🌍 عام", connOnly:"🔗 اتصالاتي فقط", myUni:"🏛️ جامعتي",
    dragFiles:"اسحب ملفاتك هنا أو", browse:"تصفح",
    fileTypes:"PDF · Word · PowerPoint · صور (حتى 50MB)",
    tags:["محاضرة","ملخص","اختبار","واجب","بحث","نقاش"],
    like:"إعجاب", comment:"تعليق", share:"مشاركة", download:"تحميل",
    writeComment:"اكتب تعليقاً...", verified:"أستاذ موثق",
    now:"الآن", agoMin:"منذ {n} دقيقة", agoHr:"منذ {n} ساعة", agoDay:"منذ {n} يوم",
    notifications:"الإشعارات", markAllRead:"تحديد الكل كمقروء",
    connReq:"أرسل لك طلب تواصل", likedPost:"أعجب بمنشورك", commentedPost:"علّق على منشورك",
    connect:"تواصل", connected:"متصلان", pending:"قيد الانتظار",
    mutual:"{n} مشترك", peopleKnow:"أشخاص قد تعرفهم",
    accept:"قبول", reject:"رفض",
    aiTitle:"AI Study Assistant", aiBy:"مدعوم بـ GPT-4",
    aiDesc:"ارفع ملفك وسيلخصه ويولد أسئلة للمذاكرة!", aiStart:"ابدأ الآن ✨",
    statsTitle:"إحصائياتك اليوم", statViews:"مشاهدات ملفاتك",
    statDl:"تحميلات اليوم", statConn:"اتصالات جديدة",
    darkMode:"الوضع المظلم", lightMode:"الوضع الفاتح", language:"اللغة",
    roles:{student:"طالب",professor:"أستاذ",researcher:"باحث",admin:"مدير"},
  },
  en: {
    dir:"ltr", flag:"🇬🇧", label:"English",
    appName:"UniConnect", appTagline:"Your Smart Academic Network",
    login:"Sign In", register:"Create Account", logout:"Sign Out",
    email:"University Email", emailPh:"you@university.edu",
    password:"Password", passwordPh:"At least 8 characters",
    forgotPw:"Forgot password?", noAccount:"Don't have an account?", haveAccount:"Already have an account?",
    welcomeBack:"Welcome back 👋", loginSub:"Sign in to access your academic network",
    loggingIn:"Signing in...", creatingAcc:"Creating your account...",
    step1Title:"Personal Information", step1Sub:"Step 1 of 2",
    step2Title:"Academic Information", step2Sub:"Step 2 of 2",
    firstName:"First Name", lastName:"Last Name", username:"Username",
    university:"University Name", faculty:"Faculty / Department",
    youAre:"You are a", student:"Student", professor:"Professor", researcher:"Researcher",
    createAcc:"Create Account 🎉", nextBtn:"Next →",
    f1:"Connect with peers & professors", f2:"Share academic files",
    f3:"Learn with AI Assistant", f4:"Join study groups",
    navHome:"Home", navConn:"My Connections", navLib:"Library",
    navMsg:"Messages", navGroups:"Groups", navAI:"AI Assistant", navSettings:"Settings",
    posts:"posts", files:"files", connections:"connections",
    postPh:"Share something academic,", uploadFile:"Upload File", discussion:"Discussion", achievement:"Achievement",
    publishNow:"Publish Now 🚀", publishTo:"Post to",
    public:"🌍 Public", connOnly:"🔗 Connections", myUni:"🏛️ My University",
    dragFiles:"Drop your files here or", browse:"browse",
    fileTypes:"PDF · Word · PowerPoint · Images (up to 50MB)",
    tags:["Lecture","Summary","Exam","Assignment","Research","Discussion"],
    like:"Like", comment:"Comment", share:"Share", download:"Download",
    writeComment:"Write a comment...", verified:"Verified Professor",
    now:"Just now", agoMin:"{n}m ago", agoHr:"{n}h ago", agoDay:"{n}d ago",
    notifications:"Notifications", markAllRead:"Mark all as read",
    connReq:"sent you a connection request", likedPost:"liked your post", commentedPost:"commented on your post",
    connect:"Connect", connected:"Connected", pending:"Pending",
    mutual:"{n} mutual", peopleKnow:"People you may know",
    accept:"Accept", reject:"Reject",
    aiTitle:"AI Study Assistant", aiBy:"Powered by GPT-4",
    aiDesc:"Upload your file and get a summary + study questions!", aiStart:"Start Now ✨",
    statsTitle:"Your Stats Today", statViews:"File Views",
    statDl:"Downloads", statConn:"New Connections",
    darkMode:"Dark Mode", lightMode:"Light Mode", language:"Language",
    roles:{student:"Student",professor:"Professor",researcher:"Researcher",admin:"Admin"},
  },
  fr: {
    dir:"ltr", flag:"🇫🇷", label:"Français",
    appName:"UniConnect", appTagline:"Votre Réseau Académique Intelligent",
    login:"Se connecter", register:"Créer un compte", logout:"Déconnexion",
    email:"Email universitaire", emailPh:"vous@universite.fr",
    password:"Mot de passe", passwordPh:"Au moins 8 caractères",
    forgotPw:"Mot de passe oublié ?", noAccount:"Pas encore de compte ?", haveAccount:"Déjà un compte ?",
    welcomeBack:"Bon retour 👋", loginSub:"Connectez-vous à votre réseau académique",
    loggingIn:"Connexion...", creatingAcc:"Création du compte...",
    step1Title:"Informations personnelles", step1Sub:"Étape 1 sur 2",
    step2Title:"Informations académiques", step2Sub:"Étape 2 sur 2",
    firstName:"Prénom", lastName:"Nom", university:"Université",
    username:"Nom d'utilisateur", faculty:"Faculté / Département",
    youAre:"Vous êtes", student:"Étudiant", professor:"Professeur", researcher:"Chercheur",
    createAcc:"Créer le compte 🎉", nextBtn:"Suivant →",
    f1:"Connectez-vous avec vos pairs", f2:"Partagez vos fichiers",
    f3:"Apprenez avec l'IA", f4:"Rejoignez des groupes d'étude",
    navHome:"Accueil", navConn:"Connexions", navLib:"Bibliothèque",
    navMsg:"Messages", navGroups:"Groupes", navAI:"Assistant IA", navSettings:"Paramètres",
    posts:"publications", files:"fichiers", connections:"connexions",
    postPh:"Partagez quelque chose,", uploadFile:"Importer", discussion:"Discussion", achievement:"Réalisation",
    publishNow:"Publier 🚀", publishTo:"Publier pour",
    public:"🌍 Public", connOnly:"🔗 Connexions", myUni:"🏛️ Mon université",
    dragFiles:"Déposez vos fichiers ici ou", browse:"parcourir",
    fileTypes:"PDF · Word · PowerPoint · Images (jusqu'à 50MB)",
    tags:["Cours","Résumé","Examen","Devoir","Recherche","Discussion"],
    like:"J'aime", comment:"Commenter", share:"Partager", download:"Télécharger",
    writeComment:"Écrire un commentaire...", verified:"Professeur vérifié",
    now:"À l'instant", agoMin:"Il y a {n}min", agoHr:"Il y a {n}h", agoDay:"Il y a {n}j",
    notifications:"Notifications", markAllRead:"Tout marquer lu",
    connReq:"vous a envoyé une demande", likedPost:"a aimé votre publication", commentedPost:"a commenté",
    connect:"Connecter", connected:"Connecté", pending:"En attente",
    mutual:"{n} en commun", peopleKnow:"Personnes que vous connaissez",
    accept:"Accepter", reject:"Refuser",
    aiTitle:"Assistant IA", aiBy:"Propulsé par GPT-4",
    aiDesc:"Importez votre fichier et obtenez un résumé + questions !", aiStart:"Commencer ✨",
    statsTitle:"Vos stats aujourd'hui", statViews:"Vues des fichiers",
    statDl:"Téléchargements", statConn:"Nouvelles connexions",
    darkMode:"Mode sombre", lightMode:"Mode clair", language:"Langue",
    roles:{student:"Étudiant",professor:"Professeur",researcher:"Chercheur",admin:"Admin"},
  },
};

// ══════════════════════════════════════════════════════════════
// CONTEXTS
// ══════════════════════════════════════════════════════════════
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

// ══════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════
const timeAgo = (date, tr) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return tr.now;
  if (mins < 60) return tr.agoMin.replace("{n}", mins);
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return tr.agoHr.replace("{n}", hrs);
  return tr.agoDay.replace("{n}", Math.floor(hrs / 24));
};
const formatSize = (b) => b < 1048576 ? `${(b/1024).toFixed(1)} KB` : `${(b/1048576).toFixed(1)} MB`;
const initials = (f, l) => `${f?.[0]||""}${l?.[0]||""}`.toUpperCase();
const fileEmoji = { pdf:"📄", pptx:"📊", docx:"📝", image:"🖼️" };
const fileBg = { pdf:"text-red-400 bg-red-500/10 border-red-500/20", pptx:"text-orange-400 bg-orange-500/10 border-orange-500/20", docx:"text-blue-400 bg-blue-500/10 border-blue-500/20", image:"text-purple-400 bg-purple-500/10 border-purple-500/20" };

// ══════════════════════════════════════════════════════════════
// MOCK DATA
// ══════════════════════════════════════════════════════════════
const ME = { id:"1", firstName:"أسامة", lastName:"الأحمدي", username:"usamah_a", role:"student", university:"جامعة الملك عبدالله", faculty:"كلية الحاسب", avatar:null, isVerifiedProfessor:false, connections:127, stats:{posts:23,files:18,likes:342}, badges:[{name_ar:"مشارك نشط",name_en:"Active Member",name_fr:"Membre actif",icon:"⭐"},{name_ar:"محرر ملفات",name_en:"File Editor",name_fr:"Éditeur",icon:"📄"}] };
const POSTS = [
  { id:"1", type:"file", author:{ firstName:"د. سارة", lastName:"المالكي", username:"dr_sarah", university:"جامعة الملك عبدالله", role:"professor", isVerifiedProfessor:true }, content:"ملخص شامل لمادة الخوارزميات - الفصل الأول. يغطي التعقيد الزمني وهياكل البيانات الأساسية 📚", attachments:[{ originalName:"ملخص_الخوارزميات.pdf", fileType:"pdf", fileSize:2457600 }], tags:["خوارزميات","برمجة","هياكل_بيانات"], subject:"تحليل الخوارزميات", likes:87, comments:24, shares:12, isLiked:false, createdAt:new Date(Date.now()-2*3600000) },
  { id:"2", type:"text", author:{ firstName:"محمد", lastName:"الشمري", username:"m_shammari", university:"جامعة الملك عبدالله", role:"student", isVerifiedProfessor:false }, content:"هل يوجد أحد يريد تشكيل مجموعة دراسية لمادة قواعد البيانات؟ الاختبار بعد أسبوعين 💪 نرحب بالجميع!", tags:["قواعد_بيانات","مجموعة_دراسية"], likes:32, comments:18, shares:5, isLiked:true, createdAt:new Date(Date.now()-5*3600000) },
  { id:"3", type:"file", author:{ firstName:"نورة", lastName:"العتيبي", username:"noura_a", university:"جامعة الملك عبدالله", role:"student", isVerifiedProfessor:false }, content:"محاضرات مادة الرياضيات المتقطعة - كل الفصول مع ملاحظاتي الشخصية ✨", attachments:[{ originalName:"رياضيات_متقطعة.pptx", fileType:"pptx", fileSize:8912400 }], tags:["رياضيات","محاضرات"], subject:"الرياضيات المتقطعة", likes:156, comments:43, shares:67, isLiked:false, createdAt:new Date(Date.now()-24*3600000) },
];
const NOTIFS = [
  { id:"1", type:"connection_request", isRead:false, sender:{ firstName:"فيصل", lastName:"الدوسري" }, createdAt:new Date(Date.now()-1800000) },
  { id:"2", type:"post_like", isRead:false, sender:{ firstName:"د. سارة", lastName:"المالكي" }, createdAt:new Date(Date.now()-7200000) },
  { id:"3", type:"post_comment", isRead:true, sender:{ firstName:"محمد", lastName:"الشمري" }, createdAt:new Date(Date.now()-18000000) },
];
const SUGGESTIONS = [
  { id:"s1", firstName:"علي", lastName:"الحربي", role:"student", university:"جامعة الملك عبدالله", mutual:5 },
  { id:"s2", firstName:"خالد", lastName:"العمري", role:"professor", university:"جامعة الملك عبدالله", isVerifiedProfessor:true, mutual:12 },
  { id:"s3", firstName:"ريم", lastName:"الأسمري", role:"researcher", university:"جامعة الملك عبدالله", mutual:3 },
];

// ══════════════════════════════════════════════════════════════
// SVG ICONS
// ══════════════════════════════════════════════════════════════
const ICONS = { home:<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>, users:<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>, book:<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>, bell:<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>, search:<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>, plus:<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>, heart:<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>, heartFill:<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor"/>, msg:<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>, share:<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>, upload:<><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></>, dl:<><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></>, userPlus:<><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></>, check:<polyline points="20 6 9 17 4 12"/>, checkCircle:<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>, x:<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>, trending:<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>, settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>, brain:<><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.54Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.54Z"/></>, sun:<><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>, moon:<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>, globe:<><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>, logOut:<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>, msgCircle:<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>, cap:<><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>, grid:<><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>, award:<><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>, chevDown:<polyline points="6 9 12 15 18 9"/> };

const Ico = ({n,s=20,c=""}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}>{ICONS[n]}</svg>
);

// ══════════════════════════════════════════════════════════════
// AVATAR
// ══════════════════════════════════════════════════════════════
const Avatar = ({ user, size = "md", online = false }) => {
  const s = { sm:"w-8 h-8 text-xs", md:"w-10 h-10 text-sm", lg:"w-14 h-14 text-base", xl:"w-20 h-20 text-xl" };
  return (
    <div className="relative flex-shrink-0">
      <div className={`${s[size]} rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br from-emerald-400 to-emerald-600`}>
        {initials(user.firstName, user.lastName)}
      </div>
      {online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-gray-900"/>}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// FILE CARD
// ══════════════════════════════════════════════════════════════
const FileCard = ({ file, tr }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl border mt-3 ${fileBg[file.fileType] || "text-gray-400 bg-gray-500/10 border-gray-500/20"}`}>
    <span className="text-2xl">{fileEmoji[file.fileType] || "📎"}</span>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-sm truncate text-gray-800 dark:text-gray-200">{file.originalName}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{file.fileType?.toUpperCase()} · {formatSize(file.fileSize)}</p>
    </div>
    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors border border-emerald-200 dark:border-emerald-700">
      <Ico n="dl" s={13}/> {tr.download}
    </button>
  </div>
);

// ══════════════════════════════════════════════════════════════
// POST CARD
// ══════════════════════════════════════════════════════════════
const PostCard = ({ post, tr, lang }) => {
  const [liked, setLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likes);
  const [showCmt, setShowCmt] = useState(false);
  const [cmt, setCmt] = useState("");

  const handleLike = () => { setLiked(!liked); setLikes(liked ? likes-1 : likes+1); };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md dark:shadow-gray-900/50 transition-all duration-200 overflow-hidden">
      <div className="p-4 pb-0 flex items-start gap-3">
        <Avatar user={post.author} size="md"/>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">{post.author.firstName} {post.author.lastName}</span>
            {post.author.isVerifiedProfessor && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-semibold">
                <Ico n="checkCircle" s={11}/> {tr.verified}
              </span>
            )}
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${post.author.role==="professor"?"bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400":"bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"}`}>
              {tr.roles?.[post.author.role] || post.author.role}
            </span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{post.author.university} · {timeAgo(post.createdAt, tr)}</p>
          {post.subject && <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-md text-xs font-medium">📚 {post.subject}</span>}
        </div>
      </div>

      <div className="p-4">
        <p className="text-gray-800 dark:text-gray-200 text-sm leading-7">{post.content}</p>
        {post.attachments?.map((f,i) => <FileCard key={i} file={f} tr={tr}/>)}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map(tag => (
              <span key={tag} className="px-2.5 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full text-xs hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 border-t border-gray-50 dark:border-gray-800">
        <span>{likes} {tr.like}</span>
        <span>{post.comments} {tr.comment} · {post.shares} {tr.share}</span>
      </div>

      <div className="px-3 py-2 flex items-center gap-1 border-t border-gray-50 dark:border-gray-800">
        {[[liked?tr.like:tr.like,liked?"heartFill":"heart",handleLike,liked?"text-red-500 bg-red-50 dark:bg-red-900/20":"text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"],
          [tr.comment,"msg",()=>setShowCmt(!showCmt),"text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"],
          [tr.share,"share",()=>{},"text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"],
        ].map(([label,icon,action,cls],i) => (
          <button key={i} onClick={action} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${cls}`}>
            <Ico n={icon} s={16}/> {label}
          </button>
        ))}
      </div>

      {showCmt && (
        <div className="px-4 pb-4 flex gap-3" style={{animation:"slideUp 0.2s ease-out"}}>
          <Avatar user={ME} size="sm"/>
          <div className="flex-1 flex gap-2">
            <input value={cmt} onChange={e=>setCmt(e.target.value)} placeholder={tr.writeComment} className="flex-1 px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-emerald-400 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"/>
            <button className="px-3 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors">{tr.send}</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// CREATE POST MODAL
// ══════════════════════════════════════════════════════════════
const CreatePostModal = ({ onClose, tr, lang }) => {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [selTags, setSelTags] = useState([]);
  const fileRef = useRef();

  const toggleTag = (tag) => setSelTags(prev => prev.includes(tag) ? prev.filter(t=>t!==tag) : [...prev, tag]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(0,0,0,0.6)",backdropFilter:"blur(6px)"}} onClick={(e)=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-gray-800" style={{animation:"bounceIn 0.3s ease-out"}}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg">نشر محتوى جديد</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-500 dark:text-gray-400"><Ico n="x" s={18}/></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex gap-3">
            <Avatar user={ME} size="md"/>
            <div>
              <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{ME.firstName} {ME.lastName}</p>
              <select className="mt-1 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-400 rounded-lg px-2 py-1 border border-gray-200 dark:border-gray-700 focus:outline-none">
                <option>{tr.public}</option><option>{tr.connOnly}</option><option>{tr.myUni}</option>
              </select>
            </div>
          </div>

          <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder={`${tr.postPh} ${ME.firstName}...`} rows={4}
            className="w-full text-sm text-gray-800 dark:text-gray-200 border-0 resize-none focus:outline-none leading-7 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent"/>

          <div onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)}
            onDrop={e=>{e.preventDefault();setDragging(false);setFiles([...files,...Array.from(e.dataTransfer.files)])}}
            onClick={()=>fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${dragging?"border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20":"border-gray-200 dark:border-gray-700 hover:border-emerald-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10"}`}>
            <Ico n="upload" s={26} c="mx-auto text-gray-400 dark:text-gray-500 mb-1.5"/>
            <p className="text-sm text-gray-500 dark:text-gray-400">{tr.dragFiles} <span className="text-emerald-500 font-semibold">{tr.browse}</span></p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{tr.fileTypes}</p>
            <input ref={fileRef} type="file" multiple className="hidden" onChange={e=>setFiles([...files,...Array.from(e.target.files)])}/>
          </div>

          {files.length > 0 && (
            <div className="space-y-1.5">
              {files.map((f,i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                  <span>📎</span>
                  <span className="flex-1 truncate text-gray-700 dark:text-gray-300 text-xs">{f.name}</span>
                  <span className="text-xs text-gray-400">{formatSize(f.size)}</span>
                  <button onClick={()=>setFiles(files.filter((_,j)=>j!==i))} className="text-gray-400 hover:text-red-400"><Ico n="x" s={13}/></button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {tr.tags.map(tag => (
              <button key={tag} onClick={()=>toggleTag(tag)} className={`px-3 py-1 text-xs rounded-full border transition-colors ${selTags.includes(tag)?"bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 text-emerald-700 dark:text-emerald-400 font-semibold":"border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-emerald-300"}`}>{tag}</button>
            ))}
          </div>
        </div>

        <div className="p-5 pt-0 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{tr.cancel}</button>
          <button className="flex-1 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/25">{tr.publishNow}</button>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// NOTIFICATIONS PANEL
// ══════════════════════════════════════════════════════════════
const NotifPanel = ({ onClose, tr }) => {
  const notifMsg = { connection_request: tr.connReq, post_like: tr.likedPost, post_comment: tr.commentedPost };
  return (
    <div className="absolute left-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden" style={{animation:"slideDown 0.2s ease-out"}}>
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">{tr.notifications}</h3>
        <button className="text-xs text-emerald-500 font-semibold hover:text-emerald-600">{tr.markAllRead}</button>
      </div>
      <div className="max-h-96 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
        {NOTIFS.map(n => (
          <div key={n.id} className={`flex items-start gap-3 p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${!n.isRead?"bg-emerald-50/40 dark:bg-emerald-900/10":""}`}>
            <Avatar user={n.sender} size="sm"/>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 dark:text-gray-200"><span className="font-bold">{n.sender.firstName}</span> {notifMsg[n.type]}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{timeAgo(n.createdAt, tr)}</p>
            </div>
            {!n.isRead && <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"/>}
          </div>
        ))}
      </div>
      <div className="p-3 text-center border-t border-gray-100 dark:border-gray-800">
        <button className="text-sm text-emerald-500 font-semibold">{tr.viewAll}</button>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// LEFT SIDEBAR
// ══════════════════════════════════════════════════════════════
const LeftSidebar = ({ tr, lang }) => {
  const navItems = [
    {icon:"home",label:tr.navHome,active:true},{icon:"users",label:tr.navConn},{icon:"book",label:tr.navLib},
    {icon:"msgCircle",label:tr.navMsg,badge:3},{icon:"grid",label:tr.navGroups},
    {icon:"brain",label:tr.navAI},{icon:"settings",label:tr.navSettings},
  ];
  return (
    <aside className="w-60 flex-shrink-0 space-y-3 hidden lg:block">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="h-16 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600"/>
        <div className="px-4 pb-4">
          <Avatar user={ME} size="lg" className="-mt-7 border-4 border-white dark:border-gray-900"/>
          <div className="mt-2">
            <div className="flex items-center gap-1.5 mt-1">
              <p className="font-bold text-gray-900 dark:text-gray-100">{ME.firstName} {ME.lastName}</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">@{ME.username}</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">{ME.university}</p>
          </div>
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            {[[ME.stats.posts,tr.posts],[ME.stats.files,tr.files],[ME.connections,tr.connections]].map(([v,l],i) => (
              <div key={i} className="flex-1 text-center">
                <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{v}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{l}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {ME.badges.map((b,i) => {
              const name = lang==="ar"?b.name_ar:lang==="fr"?b.name_fr:b.name_en;
              return <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-xs">{b.icon} {name}</span>;
            })}
          </div>
        </div>
      </div>

      <nav className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-2 space-y-0.5">
        {navItems.map(item => (
          <button key={item.label} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${item.active?"bg-emerald-500 text-white shadow-lg shadow-emerald-500/25":"text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
            <Ico n={item.icon} s={17} c={item.active?"text-white":"text-gray-400 dark:text-gray-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400"}/>
            <span className="flex-1 text-right">{item.label}</span>
            {item.badge && !item.active && <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{item.badge}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
};

// ══════════════════════════════════════════════════════════════
// RIGHT SIDEBAR
// ══════════════════════════════════════════════════════════════
const RightSidebar = ({ tr }) => (
  <aside className="w-68 flex-shrink-0 space-y-3 hidden xl:block">
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4">
      <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2 text-sm">
        <Ico n="userPlus" s={16} c="text-emerald-500"/> {tr.peopleKnow}
      </h3>
      <div className="space-y-3">
        {SUGGESTIONS.map(p => (
          <div key={p.id} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{initials(p.firstName,p.lastName)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="font-semibold text-gray-900 dark:text-gray-100 text-xs truncate">{p.firstName} {p.lastName}</p>
                {p.isVerifiedProfessor && <Ico n="checkCircle" s={11} c="text-emerald-500 flex-shrink-0"/>}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">{tr.roles?.[p.role]} · {tr.mutual.replace("{n}",p.mutual)}</p>
            </div>
            <button className="px-2.5 py-1 border border-emerald-400 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors flex-shrink-0">{tr.connect}</button>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center"><Ico n="brain" s={16} c="text-white"/></div>
        <div><p className="font-bold text-sm">{tr.aiTitle}</p><p className="text-xs text-emerald-100">{tr.aiBy}</p></div>
      </div>
      <p className="text-xs text-emerald-50 mb-3 leading-5">{tr.aiDesc}</p>
      <button className="w-full py-2 bg-white text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-colors">{tr.aiStart}</button>
    </div>

    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4">
      <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2 text-sm">
        <Ico n="trending" s={16} c="text-emerald-500"/> {tr.statsTitle}
      </h3>
      {[[tr.statViews,"1,247","+12%"],[tr.statDl,"89","+5%"],[tr.statConn,"7","+3"]].map(([l,v,c],i) => (
        <div key={i} className="flex items-center justify-between mb-2.5">
          <span className="text-xs text-gray-500 dark:text-gray-400">{l}</span>
          <div className="flex items-center gap-1.5"><span className="font-bold text-gray-900 dark:text-gray-100 text-sm">{v}</span><span className="text-xs text-emerald-500 font-medium">{c}</span></div>
        </div>
      ))}
    </div>
  </aside>
);

// ══════════════════════════════════════════════════════════════
// LANGUAGE & THEME SWITCHER
// ══════════════════════════════════════════════════════════════
const ControlBar = ({ lang, setLang, dark, setDark, tr }) => {
  const [open, setOpen] = useState(false);
  const langs = [{code:"ar",flag:"🇸🇦",label:"العربية"},{code:"en",flag:"🇬🇧",label:"English"},{code:"fr",flag:"🇫🇷",label:"Français"}];
  return (
    <div className="flex items-center gap-2">
      {/* Language */}
      <div className="relative">
        <button onClick={()=>setOpen(!open)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400">
          <span className="text-base">{langs.find(l=>l.code===lang)?.flag}</span>
          <Ico n="chevDown" s={14}/>
        </button>
        {open && (
          <div className="absolute top-full mt-1 right-0 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 w-36" style={{animation:"slideDown 0.15s ease-out"}}>
            {langs.map(l => (
              <button key={l.code} onClick={()=>{setLang(l.code);setOpen(false)}} className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${lang===l.code?"text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20":""} text-gray-700 dark:text-gray-300`}>
                <span>{l.flag}</span><span>{l.label}</span>
                {lang===l.code && <Ico n="check" s={13} c="mr-auto text-emerald-500"/>}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Dark Mode */}
      <button onClick={()=>setDark(!dark)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400">
        <Ico n={dark?"sun":"moon"} s={18}/>
      </button>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// SUPABASE STATUS BADGE (للتوضيح)
// ══════════════════════════════════════════════════════════════
const SupabaseBadge = () => (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs text-emerald-700 dark:text-emerald-400 font-medium">
    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/>
    متصل بـ Supabase
  </div>
);

// ══════════════════════════════════════════════════════════════
// LOGIN PAGE
// ══════════════════════════════════════════════════════════════
const LoginPage = ({ onLogin, onGoRegister, tr, lang, dark, setDark, setLang }) => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isRTL = tr.dir === "rtl";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authService.login({ email, password: pw });
      onLogin();
    } catch (err) {
      setError(err.message || "حدث خطأ في تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex ${isRTL?"flex-row-reverse":""} bg-gray-50 dark:bg-gray-950`} dir={tr.dir}>
      {/* Decorative Panel */}
      <div className="hidden lg:flex w-5/12 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(6)].map((_,i) => (
            <div key={i} className="absolute rounded-full border border-white/10" style={{width:`${200+i*100}px`,height:`${200+i*100}px`,top:`${-50+i*30}%`,left:`${-20+i*20}%`,opacity:0.3-i*0.04}}/>
          ))}
        </div>
        <div className="relative z-10 text-white text-center max-w-xs">
          <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/20">
            <Ico n="cap" s={38} c="text-white"/>
          </div>
          <h1 className="text-4xl font-black mb-2">{tr.appName}</h1>
          <p className="text-emerald-100 text-base mb-8">{tr.appTagline}</p>
          <div className="space-y-3">
            {[tr.f1,tr.f2,tr.f3,tr.f4].map((f,i) => (
              <div key={i} className={`flex items-center gap-3 ${isRTL?"flex-row-reverse":""}`}>
                <Ico n="checkCircle" s={18} c="text-emerald-200 flex-shrink-0"/>
                <span className="text-emerald-50 text-sm">{f}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-white/20">
            <SupabaseBadge/>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center"><Ico n="cap" s={22} c="text-white"/></div>
              <span className="font-black text-xl text-gray-900 dark:text-gray-100 hidden sm:block">{tr.appName}</span>
            </div>
            <ControlBar lang={lang} setLang={setLang} dark={dark} setDark={setDark} tr={tr}/>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-1">{tr.welcomeBack}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-7">{tr.loginSub}</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">{tr.email}</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder={tr.emailPh} dir="ltr" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 dark:focus:ring-emerald-900/20 transition-all bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500" required/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">{tr.password}</label>
                <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder={tr.passwordPh} dir="ltr" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 dark:focus:ring-emerald-900/20 transition-all bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400" required/>
                <button type="button" className={`mt-1 text-xs text-emerald-500 font-semibold ${isRTL?"float-right":"float-left"}`}>{tr.forgotPw}</button>
              </div>
              <button type="submit" disabled={loading} className="w-full py-3.5 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-70 flex items-center justify-center gap-2 mt-2">
                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" style={{animation:"spin 0.7s linear infinite"}}/>{tr.loggingIn}</> : tr.login}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">{tr.noAccount} <button onClick={onGoRegister} className="text-emerald-500 font-bold hover:text-emerald-600">{tr.register}</button></p>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <SupabaseBadge/>
          </div>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// REGISTER PAGE
// ══════════════════════════════════════════════════════════════
const RegisterPage = ({ onRegister, onGoLogin, tr, lang, dark, setDark, setLang }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ firstName:"", lastName:"", username:"", email:"", password:"", university:"", faculty:"", role:"student" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isRTL = tr.dir === "rtl";
  const upd = (k,v) => setForm(p=>({...p,[k]:v}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(step === 1) { setStep(2); return; }
    setLoading(true);
    setError("");
    try {
      await authService.register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        university: form.university,
        faculty: form.faculty,
        role: form.role,
      });
      onRegister();
    } catch (err) {
      setError(err.message || "حدث خطأ في إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  const roles = [{value:"student",label:tr.student,icon:"🎓"},{value:"professor",label:tr.professor,icon:"👨‍🏫"},{value:"researcher",label:tr.researcher,icon:"🔬"}];

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6`} dir={tr.dir}>
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center"><Ico n="cap" s={22} c="text-white"/></div>
            <span className="font-black text-xl text-gray-900 dark:text-gray-100">{tr.appName}</span>
          </div>
          <ControlBar lang={lang} setLang={setLang} dark={dark} setDark={setDark} tr={tr}/>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
          {/* Steps */}
          <div className="flex items-center gap-3 mb-6">
            {[1,2].map(s => (
              <span key={s} className="contents">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step>=s?"bg-emerald-500 text-white":"bg-gray-100 dark:bg-gray-800 text-gray-400"}`}>
                  {step>s ? <Ico n="check" s={14} c="text-white"/> : s}
                </div>
                {s < 2 && <div className={`flex-1 h-1 rounded-full transition-all ${step>s?"bg-emerald-500":"bg-gray-100 dark:bg-gray-800"}`}/>}
              </span>
            ))}
          </div>

          <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-1">{step===1?tr.step1Title:tr.step2Title}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{step===1?tr.step1Sub:tr.step2Sub}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
            {step === 1 ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {[[tr.firstName,"firstName"],[tr.lastName,"lastName"]].map(([l,k]) => (
                    <div key={k}>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">{l}</label>
                      <input value={form[k]} onChange={e=>upd(k,e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 dark:focus:ring-emerald-900/20 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all" required/>
                    </div>
                  ))}
                </div>
                {[[tr.username,"username","ltr"],[tr.email,"email","ltr"],[tr.password,"password","ltr"]].map(([l,k,d]) => (
                  <div key={k}>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">{l}</label>
                    <input type={k==="password"?"password":k==="email"?"email":"text"} value={form[k]} onChange={e=>upd(k,e.target.value)} dir={d} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 dark:focus:ring-emerald-900/20 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all" required/>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">{tr.youAre}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {roles.map(r => (
                      <button type="button" key={r.value} onClick={()=>upd("role",r.value)} className={`p-3 rounded-xl border text-center text-sm font-semibold transition-all ${form.role===r.value?"border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400":"border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-emerald-300"}`}>
                        <div className="text-lg mb-1">{r.icon}</div>{r.label}
                      </button>
                    ))}
                  </div>
                </div>
                {[[tr.university,"university"],[tr.faculty,"faculty"]].map(([l,k]) => (
                  <div key={k}>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">{l}</label>
                    <input value={form[k]} onChange={e=>upd(k,e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 dark:focus:ring-emerald-900/20 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all" required={k==="university"}/>
                  </div>
                ))}
              </>
            )}
            <button type="submit" disabled={loading} className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" style={{animation:"spin 0.7s linear infinite"}}/>{tr.creatingAcc}</> : step===2 ? tr.createAcc : tr.nextBtn}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">{tr.haveAccount} <button onClick={onGoLogin} className="text-emerald-500 font-bold">{tr.login}</button></p>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// FEED PAGE
// ══════════════════════════════════════════════════════════════
const FeedPage = ({ onLogout, tr, lang, dark, setDark, setLang }) => {
  const [posts, setPosts] = useState(POSTS);
  const [showCreate, setShowCreate] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [search, setSearch] = useState("");
  const unread = NOTIFS.filter(n=>!n.isRead).length;
  const isRTL = tr.dir === "rtl";

  // جلب المنشورات من Supabase
  useEffect(() => {
    postsService.getFeed({ page: 1, limit: 20 })
      .then(({ posts: data }) => {
        if (data && data.length > 0) {
          const mapped = data.map(p => ({
            id: p.id,
            type: p.post_type || "text",
            author: {
              firstName: p.profiles?.first_name || "مستخدم",
              lastName: p.profiles?.last_name || "",
              username: p.profiles?.username || "",
              university: p.profiles?.university || "",
              role: p.profiles?.role || "student",
              isVerifiedProfessor: p.profiles?.is_verified_professor || false,
            },
            content: p.content,
            attachments: p.file_attachments || [],
            tags: p.tags || [],
            subject: p.subject || "",
            likes: p.likes?.length || 0,
            comments: 0,
            shares: 0,
            isLiked: false,
            createdAt: p.created_at,
          }));
          setPosts(mapped);
        }
      })
      .catch(() => {
        // في حالة الخطأ نبقى على البيانات الوهمية
      });
  }, []);

  useEffect(() => {
    const close = () => setShowNotif(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200" dir={tr.dir}>
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-15 flex items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center"><Ico n="cap" s={19} c="text-white"/></div>
            <span className="font-black text-gray-900 dark:text-gray-100 text-lg hidden sm:block">{tr.appName}</span>
          </div>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Ico n="search" s={15} c={`absolute ${isRTL?"right-3":"left-3"} top-1/2 -translate-y-1/2 text-gray-400`}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={tr.search+"..."} className={`w-full ${isRTL?"pr-9 pl-4":"pl-9 pr-4"} py-2 text-sm bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-emerald-400 focus:bg-white dark:focus:bg-gray-900 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all`}/>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <ControlBar lang={lang} setLang={setLang} dark={dark} setDark={setDark} tr={tr}/>

            <div className="relative" onClick={e=>e.stopPropagation()}>
              <button onClick={()=>setShowNotif(!showNotif)} className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <Ico n="bell" s={19} c="text-gray-600 dark:text-gray-400"/>
                {unread > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">{unread}</span>}
              </button>
              {showNotif && <NotifPanel onClose={()=>setShowNotif(false)} tr={tr}/>}
            </div>

            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"><Ico n="msgCircle" s={19} c="text-gray-600 dark:text-gray-400"/></button>

            <button onClick={onLogout} className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <Avatar user={ME} size="sm"/>
              <Ico n="logOut" s={15} c="text-gray-400 dark:text-gray-500 hidden sm:block"/>
            </button>
          </div>
        </div>
      </header>

      {/* SUPABASE BANNER */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-900/20 dark:to-teal-900/20 border-b border-emerald-100 dark:border-emerald-900/30">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/>
          متصل بـ Supabase · {" "}
          <span className="font-mono text-xs opacity-70">jwjmdqbuuoheukqlvqzl.supabase.co</span>
          <span className="mx-1">·</span> Realtime مفعّل ✓ · RLS مفعّل ✓
        </div>
      </div>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex gap-5">
          <LeftSidebar tr={tr} lang={lang}/>

          {/* CENTER */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Create Post Box */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4">
              <div className="flex items-center gap-3">
                <Avatar user={ME} size="md"/>
                <button onClick={()=>setShowCreate(true)} className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl text-sm text-gray-400 dark:text-gray-500 text-right transition-colors border border-gray-100 dark:border-gray-700">
                  {tr.postPh} {ME.firstName}... 📚
                </button>
              </div>
              <div className="flex gap-1.5 mt-3 pt-3 border-t border-gray-50 dark:border-gray-800">
                {[
                  [tr.uploadFile,"upload","text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"],
                  [tr.discussion,"msg","text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"],
                  [tr.achievement,"award","text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"],
                ].map(([l,ic,cls]) => (
                  <button key={l} onClick={()=>setShowCreate(true)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors ${cls}`}>
                    <Ico n={ic} s={15}/>{l}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts */}
            {posts.map(p => <PostCard key={p.id} post={p} tr={tr} lang={lang}/>)}

            <div className="text-center pb-8">
              <button className="px-6 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-xl text-sm font-semibold hover:border-emerald-400 hover:text-emerald-600 dark:hover:border-emerald-700 dark:hover:text-emerald-400 transition-all shadow-sm">
                {tr.seeMore}
              </button>
            </div>
          </div>

          <RightSidebar tr={tr}/>
        </div>
      </main>

      {showCreate && <CreatePostModal onClose={()=>setShowCreate(false)} tr={tr} lang={lang}/>}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("login");
  const [lang, setLang] = useState("ar");
  const [dark, setDark] = useState(false);

  const tr = TRANSLATIONS[lang];
  const isRTL = tr.dir === "rtl";

  // التحقق من جلسة المستخدم عند فتح الموقع
  useEffect(() => {
    authService.getCurrentUser().then(user => {
      if (user) setPage("feed");
    }).catch(() => {});
  }, []);

  // System dark mode detection
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const handler = (e) => setDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Apply dark class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const fontFamily = lang === "ar" ? "'IBM Plex Sans Arabic', 'Noto Sans Arabic', sans-serif" : "'DM Sans', system-ui, sans-serif";

  return (
    <div style={{ fontFamily }} dir={tr.dir}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html.dark { color-scheme: dark; }
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bounceIn  { 0%{transform:scale(0.92);opacity:0} 70%{transform:scale(1.02)} 100%{transform:scale(1);opacity:1} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:4px; }
        .dark ::-webkit-scrollbar-thumb { background:#334155; }
        ::-webkit-scrollbar-thumb:hover { background:#10b981; }

        /* Tailwind-like dark mode utilities */
        .dark .dark\\:bg-gray-950 { background-color: #030712; }
        .dark .dark\\:bg-gray-900 { background-color: #111827; }
        .dark .dark\\:bg-gray-800 { background-color: #1f2937; }
        .dark .dark\\:text-gray-100 { color: #f3f4f6; }
        .dark .dark\\:text-gray-200 { color: #e5e7eb; }
        .dark .dark\\:text-gray-300 { color: #d1d5db; }
        .dark .dark\\:text-gray-400 { color: #9ca3af; }
        .dark .dark\\:text-gray-500 { color: #6b7280; }
        .dark .dark\\:border-gray-800 { border-color: #1f2937; }
        .dark .dark\\:border-gray-700 { border-color: #374151; }
        .dark .dark\\:hover\\:bg-gray-800:hover { background-color: #1f2937; }
        .dark .dark\\:hover\\:bg-gray-700\\/50:hover { background-color: rgba(55,65,81,0.5); }
        .dark .dark\\:text-emerald-400 { color: #34d399; }
        .dark .dark\\:border-emerald-700 { border-color: #047857; }
        .dark .dark\\:bg-emerald-900\\/20 { background-color: rgba(6,78,59,0.2); }
        .dark .dark\\:bg-emerald-900\\/10 { background-color: rgba(6,78,59,0.1); }
        .dark .dark\\:focus\\:bg-gray-900:focus { background-color: #111827; }
        .dark .dark\\:hover\\:text-emerald-400:hover { color: #34d399; }
        .dark .dark\\:hover\\:border-emerald-700:hover { border-color: #047857; }
        .dark .dark\\:bg-gray-900\\/90 { background-color: rgba(17,24,39,0.9); }
        .dark .dark\\:border-emerald-900\\/30 { border-color: rgba(6,78,59,0.3); }
        .dark .dark\\:from-emerald-900\\/20 { --tw-gradient-from: rgba(6,78,59,0.2); }
        .dark .dark\\:to-teal-900\\/20 { --tw-gradient-to: rgba(19,78,74,0.2); }
        .dark .dark\\:bg-purple-900\\/30 { background-color: rgba(88,28,135,0.3); }
        .dark .dark\\:text-purple-400 { color: #c084fc; }
        .dark .dark\\:bg-blue-900\\/30 { background-color: rgba(30,58,138,0.3); }
        .dark .dark\\:text-blue-400 { color: #60a5fa; }
        .dark .dark\\:shadow-gray-900\\/50 { --tw-shadow-color: rgba(17,24,39,0.5); }
        .dark .dark\\:bg-red-900\\/20 { background-color: rgba(127,29,29,0.2); }
        .dark .dark\\:bg-amber-900\\/20 { background-color: rgba(120,53,15,0.2); }
        .dark .dark\\:bg-blue-900\\/20 { background-color: rgba(30,58,138,0.2); }
        .dark .dark\\:hover\\:bg-red-900\\/20:hover { background-color: rgba(127,29,29,0.2); }
        .dark .dark\\:hover\\:bg-amber-900\\/20:hover { background-color: rgba(120,53,15,0.2); }
        .dark .dark\\:hover\\:bg-blue-900\\/20:hover { background-color: rgba(30,58,138,0.2); }
        .dark .dark\\:hover\\:bg-emerald-900\\/20:hover { background-color: rgba(6,78,59,0.2); }
        .dark .dark\\:hover\\:bg-gray-800\\/50:hover { background-color: rgba(31,41,55,0.5); }
        .dark .dark\\:text-amber-400 { color: #fbbf24; }
        .dark .dark\\:bg-amber-900\\/20 { background-color: rgba(120,53,15,0.2); }
        .dark .dark\\:bg-emerald-900\\/30 { background-color: rgba(6,78,59,0.3); }
        .dark .dark\\:bg-emerald-900\\/40 { background-color: rgba(6,78,59,0.4); }
        .dark .dark\\:focus\\:ring-emerald-900\\/20 { --tw-ring-color: rgba(6,78,59,0.2); }
        .dark .dark\\:text-gray-950 { color: #030712; }
        .dark .dark\\:border-gray-900 { border-color: #111827; }
        .dark .dark\\:placeholder-gray-500::placeholder { color: #6b7280; }
        .dark .dark\\:border-emerald-800 { border-color: #065f46; }
      `}</style>

      {page === "login"    && <LoginPage    onLogin={()=>setPage("feed")} onGoRegister={()=>setPage("register")} tr={tr} lang={lang} dark={dark} setDark={setDark} setLang={setLang}/>}
      {page === "register" && <RegisterPage onRegister={()=>setPage("feed")} onGoLogin={()=>setPage("login")} tr={tr} lang={lang} dark={dark} setDark={setDark} setLang={setLang}/>}
      {page === "feed"     && <FeedPage     onLogout={()=>setPage("login")} tr={tr} lang={lang} dark={dark} setDark={setDark} setLang={setLang}/>}
    </div>
  );
}
