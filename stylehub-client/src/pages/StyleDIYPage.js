// src/pages/StyleDIYPage.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeart, 
  faComment, 
  faShare, 
  faTrash, 
  faImage,
  faShoppingBag,
  faThumbsUp,
  faUser,
  faStar,
  faPlusCircle
} from '@fortawesome/free-solid-svg-icons';
import { 
  getStyleDIYPosts, 
  createStyleDIYPost, 
  likeStyleDIYPost, 
  addStyleDIYComment,
  addStyleDIYRecommendation,
  deleteStyleDIYPost
} from '../api/styleDIYService';
import { useAuth } from '../context/AuthContext';
import { getProducts } from '../api/productService';
import { getServices } from '../api/serviceService';
import Container from '../components/Container';
import Card from '../components/Card';

function StyleDIYPage() {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRecommendModal, setShowRecommendModal] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(null);
  
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    productId: '',
    serviceId: '',
    image: null,
    video: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  
  const [commentText, setCommentText] = useState('');
  const [recommendation, setRecommendation] = useState({
    sellerId: '',
    providerId: '',
    productId: '',
    serviceId: '',
    comment: ''
  });
  
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [liking, setLiking] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    loadPosts();
    if (showCreateModal || showRecommendModal) {
      loadProductsAndServices();
    }
  }, [showCreateModal, showRecommendModal]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await getStyleDIYPosts({ limit: 20 });
      setPosts(data.posts || data || []);
    } catch (err) {
      setError(err.message || 'Failed to load posts.');
    } finally {
      setLoading(false);
    }
  };

  const loadProductsAndServices = async () => {
    try {
      const [productsData, servicesData] = await Promise.all([
        getProducts({ limit: 50 }),
        getServices({ limit: 50 })
      ]);
      setProducts(productsData.products || productsData || []);
      setServices(servicesData.services || servicesData || []);
    } catch (err) {
      console.error('Error loading products/services:', err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please login to create a post.');
      return;
    }

    const title = newPost.title?.trim();
    if (!title) {
      alert('Please enter a title for your post.');
      return;
    }

    try {
      const postData = {
        title: title, // Ensure title is always a non-empty string
        content: newPost.content?.trim() || undefined,
        productId: newPost.productId || undefined,
        serviceId: newPost.serviceId || undefined,
        image: newPost.image instanceof File ? newPost.image : undefined,
        video: newPost.video instanceof File ? newPost.video : undefined,
      };

      await createStyleDIYPost(postData);
      setShowCreateModal(false);
      setNewPost({ title: '', content: '', productId: '', serviceId: '', image: null, video: null });
      setImagePreview(null);
      setVideoPreview(null);
      loadPosts();
      alert('Post created successfully!');
    } catch (err) {
      alert(`Failed to create post: ${err.message}`);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        // Clear video if image is selected
        setNewPost({ ...newPost, image: file, video: null });
        setVideoPreview(null);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file.');
      }
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        // Clear image if video is selected
        setNewPost({ ...newPost, video: file, image: null });
        setImagePreview(null);
        const reader = new FileReader();
        reader.onloadend = () => setVideoPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        alert('Please select a video file.');
      }
    }
  };

  const handleLike = async (postId) => {
    if (!token) {
      alert('Please login to like posts.');
      return;
    }

    setLiking(postId);
    try {
      await likeStyleDIYPost(postId);
      loadPosts();
    } catch (err) {
      alert(`Failed to like post: ${err.message}`);
    } finally {
      setLiking(null);
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;

    try {
      await addStyleDIYComment(postId, commentText);
      setCommentText('');
      setShowCommentModal(null);
      loadPosts();
    } catch (err) {
      alert(`Failed to add comment: ${err.message}`);
    }
  };

  const handleAddRecommendation = async (postId) => {
    if (!recommendation.sellerId && !recommendation.providerId && !recommendation.productId && !recommendation.serviceId) {
      alert('Please select at least one recommendation target.');
      return;
    }

    try {
      await addStyleDIYRecommendation(postId, recommendation);
      setRecommendation({ sellerId: '', providerId: '', productId: '', serviceId: '', comment: '' });
      setShowRecommendModal(null);
      loadPosts();
      alert('Recommendation added successfully!');
    } catch (err) {
      alert(`Failed to add recommendation: ${err.message}`);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    setDeleting(postId);
    try {
      await deleteStyleDIYPost(postId);
      loadPosts();
      alert('Post deleted successfully.');
    } catch (err) {
      alert(`Failed to delete post: ${err.message}`);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="page-section">
        <div className="text-center py-20">
          <p className="text-gray-600">Loading Style DIY posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-section">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  // Topic hubs (community pillars)
  const topicHubs = [
    { key: 'skincare', title: 'Skincare & Beauty Tips', desc: 'Everyday routines, product tips, and expert advice', icon: faImage },
    { key: 'reviews', title: 'Service Reviews', desc: 'Honest experiences with service providers', icon: faComment },
    { key: 'marketplace', title: 'Product Talks', desc: 'Discussions about products on the marketplace', icon: faShoppingBag || faStar },
    { key: 'updates', title: 'Glowist Updates', desc: 'Announcements and release notes', icon: faStar },
    { key: 'tech', title: 'Tech Corner', desc: 'App help, bug reports, and suggestions', icon: faUser },
    { key: 'offtopic', title: 'Off-Topic Lounge', desc: 'A little space to be human', icon: faHeart },
  ];

  // Top contributors
  const contributorsMap = posts.reduce((acc, p) => {
    const id = p.user?.id || 'anon';
    if (!acc[id]) acc[id] = { id, name: p.user?.name || p.user?.email || 'Anonymous', count: 0 };
    acc[id].count += 1;
    return acc;
  }, {});
  const contributors = Object.values(contributorsMap).sort((a, b) => b.count - a.count).slice(0, 6);

  return (
    <div className="page-transition" style={{ paddingBottom: '100px', minHeight: '100vh' }}>
      <Container>
        {/* Hero */}
        <div className="rounded-xl p-8 mb-6" style={{ background: 'linear-gradient(135deg,#fff0f6,#f0f6ff)' }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div style={{ flex: 1 }}>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Welcome to the Glowist Community — Where Skills Grow and Stories Shine.</h1>
              <p className="text-gray-700 mb-4">Share tips, celebrate transformations, and discover trusted recommendations from our members.</p>
              <div className="flex items-center gap-3">
                <button onClick={() => token ? setShowCreateModal(true) : window.location.assign('/login')} className="btn btn-primary">Join the Conversation</button>
                <button onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })} className="btn btn-outline">Explore Topics</button>
              </div>
            </div>
            <div style={{ width: '320px' }} className="hidden md:block">
              {/* subtle illustration placeholder */}
              <div style={{ height: 160, borderRadius: 12, background: 'linear-gradient(180deg,#fff,#f7f7ff)' }} />
            </div>
          </div>
        </div>

        {/* Topic Hubs */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Topic Hubs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topicHubs.map(h => (
              <Card key={h.key} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg,var(--color-primary),var(--color-blue))' }}>
                    <FontAwesomeIcon icon={h.icon} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{h.title}</h3>
                    <p className="text-sm text-gray-600">{h.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured / Trending */}
        {posts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Featured & Trending</h2>
            <div className="overflow-x-auto flex gap-4 pb-2">
              {posts.slice(0, 8).map(p => (
                <div key={p.id} className="bg-white rounded-lg shadow p-4 min-w-[260px]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg,var(--color-primary),var(--color-blue))' }}>{(p.user?.name||p.user?.email||'U').charAt(0).toUpperCase()}</div>
                    <div>
                      <div className="text-sm font-semibold">{p.user?.name || 'Anonymous'}</div>
                      <div className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <h3 className="font-bold text-md mb-2 truncate">{p.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{p.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Post Box */}
        {token && (
          <Card className="mb-6">
            <h3 className="font-bold mb-2">Share your thoughts</h3>
            <form onSubmit={handleCreatePost}>
              <input value={newPost.title} onChange={(e)=>setNewPost({...newPost,title:e.target.value})} placeholder="Share your thoughts, tips, or questions..." className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3" />
              <div className="flex items-center gap-3 mb-3">
                <select value={newPost.productId} onChange={(e)=>setNewPost({...newPost,productId:e.target.value})} className="px-3 py-2 border rounded">
                  <option value="">Related product (optional)</option>
                  {products.map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <select value={newPost.serviceId} onChange={(e)=>setNewPost({...newPost,serviceId:e.target.value})} className="px-3 py-2 border rounded">
                  <option value="">Related service (optional)</option>
                  {services.map(s=> <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn btn-primary">Post</button>
                <button type="button" onClick={()=>{setNewPost({title:'',content:'',productId:'',serviceId:'',image:null,video:null});setImagePreview(null);setVideoPreview(null);}} className="btn btn-outline">Clear</button>
              </div>
            </form>
          </Card>
        )}

        {/* Contributors / Spotlights */}
        {contributors.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Member Spotlights</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {contributors.map(c=> (
                <Card key={c.id} className="p-3 text-center">
                  <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg,var(--color-primary),var(--color-blue))' }}>{(c.name||'U').charAt(0).toUpperCase()}</div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.count} post(s)</div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Resource Library */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Resource Library</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card><Link to="/help">Beginner guides</Link></Card>
            <Card><Link to="/safety">Safety tips</Link></Card>
            <Card><Link to="/faqs">FAQs</Link></Card>
            <Card><Link to="/how-to-book">How to book services</Link></Card>
          </div>
        </div>

        {/* Did You Know / Footer line */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Powered by the people — grounded in tradition — built for tomorrow.</p>
        </div>

        {/* Existing posts list continues below */}
        <div className="mt-6">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg mb-4">No posts yet. Be the first to share your style knowledge!</p>
              {token && (
                <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">Create First Post</button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="card" style={{ width: '100%', marginBottom: '20px' }}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-blue))' }}
                      >
                        {(post.user?.name || post.user?.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{post.user?.name || 'Anonymous'}</p>
                        <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {user && post.userId === user.id && (
                      <button onClick={() => handleDeletePost(post.id)} disabled={deleting === post.id} className="text-red-500 hover:text-red-700"><FontAwesomeIcon icon={faTrash} /></button>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-3">{post.title}</h2>
                  {post.content && <p className="text-gray-700 mb-4">{post.content}</p>}
                  {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="w-full rounded-lg mb-4 object-cover" />}
                  {post.videoUrl && <video src={post.videoUrl} controls className="w-full rounded-lg mb-4" />}
                  <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => handleLike(post.id)} disabled={liking === post.id || !token} className="flex items-center gap-2 text-gray-600 hover:text-primary"><FontAwesomeIcon icon={faHeart} /> <span>{post.likes || 0}</span></button>
                    <button onClick={() => setShowCommentModal(post.id)} className="flex items-center gap-2 text-gray-600 hover:text-primary"><FontAwesomeIcon icon={faComment} /> <span>{post._count?.comments || 0}</span></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Post Modal (kept) */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" style={{ zIndex: 1000, overflowY: 'auto' }}>
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ maxHeight: '90vh', overflowY: 'auto', margin: '20px 0' }}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Create Style DIY Post</h2>
                  <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                <form onSubmit={handleCreatePost}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input type="text" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., How to use this product..." />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Describe your tip or tutorial..." />
                  </div>
                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Image</label>
                      <input type="file" accept="image/*" onChange={handleImageChange} disabled={!!newPost.video} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Video</label>
                      <input type="file" accept="video/*" onChange={handleVideoChange} disabled={!!newPost.image} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <select value={newPost.productId} onChange={(e) => setNewPost({ ...newPost, productId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="">Related Product (optional)</option>
                      {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <select value={newPost.serviceId} onChange={(e) => setNewPost({ ...newPost, serviceId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="">Related Service (optional)</option>
                      {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="btn btn-primary flex-1">Create Post</button>
                    <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-outline">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {/* Recommendation Modal */}
        {showRecommendModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Add Recommendation</h2>
                  <button
                    onClick={() => {
                      setShowRecommendModal(null);
                      setRecommendation({ sellerId: '', providerId: '', productId: '', serviceId: '', comment: '' });
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recommend Product</label>
                    <select
                      value={recommendation.productId}
                      onChange={(e) => setRecommendation({ ...recommendation, productId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">None</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recommend Service</label>
                    <select
                      value={recommendation.serviceId}
                      onChange={(e) => setRecommendation({ ...recommendation, serviceId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">None</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comment (Optional)</label>
                    <textarea
                      value={recommendation.comment}
                      onChange={(e) => setRecommendation({ ...recommendation, comment: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Why do you recommend this?"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAddRecommendation(showRecommendModal)}
                      className="btn btn-primary flex-1"
                    >
                      Add Recommendation
                    </button>
                    <button
                      onClick={() => {
                        setShowRecommendModal(null);
                        setRecommendation({ sellerId: '', providerId: '', productId: '', serviceId: '', comment: '' });
                      }}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default StyleDIYPage;

