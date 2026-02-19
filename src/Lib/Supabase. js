import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jwjmdqbuuoheukqlvqzl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3am1kcWJ1dW9oZXVrcWx2cXpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNTc0NDEsImV4cCI6MjA4NjkzMzQ0MX0.7Fk80O6O-Vxs-A4YAUpPCd7XYuwwITK1gm5c40NF6hw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const authService = {
  register: async ({ email, password, firstName, lastName, username, university, faculty, role }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName, username, university, faculty, role }
      }
    });
    if (error) throw error;
    if (data.user) {
      await supabase.from('profiles')
        .update({ first_name: firstName, last_name: lastName, username, university, faculty, role })
        .eq('id', data.user.id);
    }
    return data;
  },

  login: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase
      .from('profiles').select('*').eq('id', user.id).single();
    return { ...user, profile };
  },
};

export const postsService = {
  getFeed: async ({ page = 1, limit = 10 }) => {
    const from = (page - 1) * limit;
    const { data, error, count } = await supabase
      .from('posts')
      .select(`*, profiles:author_id (id, first_name, last_name, username, avatar_url, role, university, is_verified_professor), file_attachments (*), likes (user_id)`, { count: 'exact' })
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);
    if (error) throw error;
    return { posts: data, total: count };
  },

  createPost: async ({ authorId, content, type, tags, subject, visibility }) => {
    const { data, error } = await supabase
      .from('posts')
      .insert({ author_id: authorId, content, post_type: type, tags, subject, visibility })
      .select(`*, profiles:author_id (*)`)
      .single();
    if (error) throw error;
    return data;
  },

  toggleLike: async (postId, userId) => {
    const { data: existing } = await supabase
      .from('likes').select('id').eq('post_id', postId).eq('user_id', userId).single();
    if (existing) {
      await supabase.from('likes').delete().eq('id', existing.id);
      return false;
    } else {
      await supabase.from('likes').insert({ post_id: postId, user_id: userId });
      return true;
    }
  },

  addComment: async (postId, authorId, content) => {
    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: postId, author_id: authorId, content })
      .select(`*, profiles:author_id (first_name, last_name, username, avatar_url)`)
      .single();
    if (error) throw error;
    return data;
  },
};

export default supabase;
