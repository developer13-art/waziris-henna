import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function JournalPreview({ articles }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-tag">📚 Henna Journal</span>
          <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-[#222] mt-3">Learn About Henna</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden border border-[#e8ddd4] hover:shadow-xl transition-all"
            >
              <Link to={`/journal/${article.slug}`}>
                <img src={article.image_url || '/images/journal-placeholder.jpg'} alt={article.title} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <span className="text-xs font-semibold text-[#D4AF37]">{article.category}</span>
                  <h3 className="font-playfair text-lg font-semibold mb-2 line-clamp-2">{article.title}</h3>
                  {article.excerpt && <p className="text-gray-600 text-sm line-clamp-2">{article.excerpt}</p>}
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/journal" className="inline-flex items-center gap-2 text-[#8B5E3C] font-semibold hover:text-[#D4AF37]">
            Read More Articles <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default JournalPreview