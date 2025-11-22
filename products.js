import React, { useState, useEffect } from 'react';
import { Heart, Search, Grid3x3, List, SlidersHorizontal, X, Share2, Eye, ShoppingCart, TrendingUp, Sparkles, Package, Star, ChevronDown, Filter, ArrowUpDown, Zap } from 'lucide-react';

// Mock data for demonstration (prices in KSH)
const MOCK_PRODUCTS = [
  { id: 1, name: "Quantum Processor X1", category: "Electronics", price: 169299, originalPrice: 208299, rating: 4.8, reviews: 245, image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400", inStock: 15, isNew: true, badge: "Trending" },
  { id: 2, name: "Neural Headphones Pro", category: "Audio", price: 52099, rating: 4.9, reviews: 892, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", inStock: 43, badge: "Best Seller" },
  { id: 3, name: "HoloLens Display", category: "Electronics", price: 325499, rating: 4.6, reviews: 156, image: "https://images.unsplash.com/photo-1592503254549-d83d24a4dfab?w=400", inStock: 8, isNew: true },
  { id: 4, name: "Smart Watch Infinity", category: "Wearables", price: 78099, originalPrice: 104099, rating: 4.7, reviews: 567, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", inStock: 22 },
  { id: 5, name: "AI Camera Drone", category: "Drones", price: 117199, rating: 4.5, reviews: 234, image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400", inStock: 12, badge: "Hot" },
  { id: 6, name: "Wireless Charger Matrix", category: "Accessories", price: 10399, rating: 4.8, reviews: 1023, image: "https://images.unsplash.com/photo-1591290619762-c588f0272c66?w=400", inStock: 67 },
  { id: 7, name: "Gaming Console Ultra", category: "Gaming", price: 91099, rating: 4.9, reviews: 2341, image: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=400", inStock: 5, badge: "Limited" },
  { id: 8, name: "Smart Speaker Hub", category: "Smart Home", price: 32549, rating: 4.6, reviews: 445, image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=400", inStock: 34, isNew: true },
];

const CATEGORIES = ["All", "Electronics", "Audio", "Wearables", "Drones", "Accessories", "Gaming", "Smart Home"];
const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

// Format currency as KSH
const formatKSH = (amount) => {
  return `KSh ${amount.toLocaleString('en-KE')}`;
};

function Products() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [wishlist, setWishlist] = useState(new Set([2, 4]));
  const [compareList, setCompareList] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 400000]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [showQuickView, setShowQuickView] = useState(null);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  useEffect(() => {
    let filtered = [...products];
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    filtered = filtered.filter(p => p.rating >= minRating);
    
    if (inStockOnly) {
      filtered = filtered.filter(p => p.inStock > 0);
    }
    
    switch(sortBy) {
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered.sort((a, b) => b.reviews - a.reviews);
    }
    
    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, priceRange, minRating, inStockOnly, sortBy, products]);

  const activeFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== 'All') count++;
    if (priceRange[0] > 0 || priceRange[1] < 400000) count++;
    if (minRating > 0) count++;
    if (inStockOnly) count++;
    return count;
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setPriceRange([0, 400000]);
    setMinRating(0);
    setInStockOnly(false);
    setSearchQuery('');
  };

  const SkeletonCard = () => (
    <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-3 animate-pulse">
      <div className="w-full aspect-square bg-white/20 rounded-lg mb-3"></div>
      <div className="h-3 bg-white/20 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-white/20 rounded w-1/2"></div>
    </div>
  );

  const ProductCard = ({ product }) => {
    const isWishlisted = wishlist.has(product.id);
    const isComparing = compareList.has(product.id);
    const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

    return (
      <div className="group relative bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 hover:border-cyan-400/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] overflow-hidden flex flex-col">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product.isNew && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1 w-fit">
              <Sparkles size={10} /> NEW
            </span>
          )}
          {product.badge && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] font-bold rounded-full w-fit">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-fit">
              -{discount}%
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <button
            onClick={(e) => { 
              e.preventDefault(); 
              setWishlist(prev => {
                const newSet = new Set(prev);
                isWishlisted ? newSet.delete(product.id) : newSet.add(product.id);
                return newSet;
              });
            }}
            className={`p-1.5 rounded-full backdrop-blur-xl border transition-all ${
              isWishlisted 
                ? 'bg-pink-500 border-pink-400 text-white' 
                : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
            }`}
          >
            <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => setShowQuickView(product)}
            className="p-1.5 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white/30 transition-all"
          >
            <Eye size={14} />
          </button>
        </div>

        {/* Image */}
        <div className="relative overflow-hidden rounded-lg m-2 aspect-square">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>

        {/* Content */}
        <div className="p-3 pt-0 flex flex-col flex-grow">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-cyan-400 text-[10px] font-semibold uppercase">{product.category}</span>
            <div className="flex items-center gap-0.5">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span className="text-white text-[11px] font-semibold">{product.rating}</span>
            </div>
          </div>
          
          <h3 className="text-white font-bold text-sm mb-2 line-clamp-2 leading-tight group-hover:text-cyan-400 transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>

          <div className="flex flex-col gap-1 mb-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-white text-lg font-bold">{formatKSH(product.price)}</span>
              {product.originalPrice && (
                <span className="text-white/50 text-xs line-through">{formatKSH(product.originalPrice)}</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
              product.inStock > 20 
                ? 'bg-green-500/20 text-green-400' 
                : product.inStock > 0 
                ? 'bg-yellow-500/20 text-yellow-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {product.inStock > 0 ? `${product.inStock} in stock` : 'Out of stock'}
            </span>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={isComparing}
                onChange={() => setCompareList(prev => {
                  const newSet = new Set(prev);
                  isComparing ? newSet.delete(product.id) : newSet.add(product.id);
                  return newSet;
                })}
                className="w-3 h-3"
              />
              <span className="text-white/70 text-[10px]">Compare</span>
            </label>
          </div>

          <button className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold text-sm rounded-lg flex items-center justify-center gap-1.5 transition-all transform hover:scale-105 mt-auto">
            <ShoppingCart size={14} />
            Add to Cart
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
            <span>Home</span>
            <span>/</span>
            <span>Products</span>
            {selectedCategory !== 'All' && (
              <>
                <span>/</span>
                <span className="text-cyan-400 truncate">{selectedCategory}</span>
              </>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Discover Products
          </h1>
          <p className="text-white/60 text-sm">Explore our futuristic collection</p>
        </div>

        {/* Search Bar */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white text-sm placeholder-white/50 focus:outline-none focus:border-cyan-400/50 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Filters Bar */}
        <div className="mb-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-3">
          <div className="flex items-center justify-between gap-2 mb-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm hover:bg-white/20 transition-all"
            >
              <Filter size={16} />
              Filters
              {activeFiltersCount() > 0 && (
                <span className="px-1.5 py-0.5 bg-cyan-500 rounded-full text-xs font-bold min-w-[20px] text-center">
                  {activeFiltersCount()}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2">
              {/* Sort - Mobile Optimized */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm cursor-pointer focus:outline-none focus:border-cyan-400/50"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-slate-800">
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* View Mode */}
              <div className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'text-white/50 hover:text-white'}`}
                >
                  <Grid3x3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-cyan-500 text-white' : 'text-white/50 hover:text-white'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Category Pills - Horizontal Scroll */}
          <div className="overflow-x-auto -mx-3 px-3 scrollbar-hide">
            <div className="flex gap-2 pb-2 min-w-max">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
              {/* Price Range */}
              <div>
                <label className="text-white text-sm font-semibold mb-2 block">Price Range</label>
                <input
                  type="range"
                  min="0"
                  max="400000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-white/70 text-xs mt-1">
                  <span>{formatKSH(priceRange[0])}</span>
                  <span>{formatKSH(priceRange[1])}</span>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-white text-sm font-semibold mb-2 block">Minimum Rating</label>
                <div className="flex gap-2">
                  {[0, 3, 4, 4.5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`flex-1 px-2 py-2 rounded-lg text-sm transition-all ${
                        minRating === rating
                          ? 'bg-yellow-500 text-white font-bold'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {rating > 0 ? `${rating}+` : 'All'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-white/70 text-sm">In Stock Only</span>
                </label>
              </div>

              {/* Clear */}
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-all font-semibold text-sm"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count & Compare Bar */}
        <div className="mb-4">
          <div className="text-white/70 text-sm mb-2">
            Showing <span className="text-white font-bold">{filteredProducts.length}</span> products
          </div>
          {compareList.size > 0 && (
            <div className="flex items-center justify-between gap-2 bg-cyan-500/20 border border-cyan-500/50 rounded-xl px-3 py-2">
              <span className="text-cyan-400 font-semibold text-sm">{compareList.size} to compare</span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all font-semibold text-sm">
                  Compare
                </button>
                <button
                  onClick={() => setCompareList(new Set())}
                  className="text-white/50 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white/5 backdrop-blur-xl rounded-xl border border-white/20">
            <Package size={48} className="mx-auto mb-3 text-white/30" />
            <h3 className="text-xl font-bold text-white mb-2">No Products Found</h3>
            <p className="text-white/60 text-sm mb-4 px-4">Try adjusting your filters</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-sm rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'list' ? 'space-y-3' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Recommended Section */}
        {!loading && filteredProducts.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="text-yellow-400" size={20} />
              <h2 className="text-xl sm:text-2xl font-bold text-white">Recommended</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {MOCK_PRODUCTS.slice(0, 4).map(product => (
                <ProductCard key={`rec-${product.id}`} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        <div className="mt-8 bg-white/5 backdrop-blur-xl rounded-xl border border-white/20 p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-cyan-400" size={20} />
            <h2 className="text-xl font-bold text-white">Recently Viewed</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {MOCK_PRODUCTS.slice(0, 6).map(product => (
              <div key={`recent-${product.id}`} className="bg-white/10 rounded-lg p-2 border border-white/20 hover:border-cyan-400/50 transition-all cursor-pointer group">
                <img src={product.image} alt={product.name} className="w-full aspect-square object-cover rounded mb-1.5 group-hover:scale-105 transition-transform" />
                <p className="text-white text-xs font-semibold line-clamp-2 leading-tight mb-1">{product.name}</p>
                <p className="text-cyan-400 text-xs font-bold">{formatKSH(product.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowQuickView(null)}>
          <div className="bg-slate-900 rounded-2xl border border-white/20 p-4 sm:p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white pr-4">{showQuickView.name}</h2>
              <button onClick={() => setShowQuickView(null)} className="text-white/50 hover:text-white flex-shrink-0">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <img src={showQuickView.image} alt={showQuickView.name} className="w-full rounded-xl" />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Star size={18} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-bold">{showQuickView.rating}</span>
                  <span className="text-white/50 text-sm">({showQuickView.reviews} reviews)</span>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-white">{formatKSH(showQuickView.price)}</span>
                  {showQuickView.originalPrice && (
                    <span className="text-lg text-white/50 line-through">{formatKSH(showQuickView.originalPrice)}</span>
                  )}
                </div>
                <p className="text-white/70 text-sm mb-4">
                  Experience the future of technology with this cutting-edge product. Designed for performance and style.
                </p>
                <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;