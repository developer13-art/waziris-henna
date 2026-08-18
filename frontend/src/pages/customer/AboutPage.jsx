import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us | Waziri's Henna</title>
        <meta name="description" content="Learn about Waziri's Henna - our story, mission, and what makes us unique." />
      </Helmet>

      <section className="pt-32 pb-12 bg-gradient-to-br from-[#FFF8F0] to-[#FFF1E6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag">Who We Are</span>
          <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-[#222] mt-4">
            About Waziri's Henna
          </h1>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="font-playfair text-3xl font-bold">Beauty, Creativity & Tradition</h2>
              <p className="text-gray-600 leading-relaxed">
                Waziri's Henna is a premium beauty brand based in Kaduna, Nigeria. We specialize in 
                elegant henna designs for weddings, Eid celebrations, birthdays, naming ceremonies, 
                and every special moment in between.
              </p>
              <p className="text-gray-600 leading-relaxed">
                With years of experience and a passion for perfection, we create stunning, long-lasting 
                henna designs that tell your unique story. Every pattern is carefully crafted to match 
                your style and occasion.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <div className="bg-white p-5 rounded-2xl border border-[#e8ddd4]">
                  <i className="fas fa-leaf text-2xl text-[#D4AF37] mb-3"></i>
                  <h3 className="font-semibold mb-1">100% Natural</h3>
                  <p className="text-sm text-gray-500">Chemical-free, skin-friendly products</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-[#e8ddd4]">
                  <i className="fas fa-heart text-2xl text-[#D4AF37] mb-3"></i>
                  <h3 className="font-semibold mb-1">Made with Love</h3>
                  <p className="text-sm text-gray-500">Every design is crafted with care</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-[#e8ddd4]">
                  <i className="fas fa-home text-2xl text-[#D4AF37] mb-3"></i>
                  <h3 className="font-semibold mb-1">Home Service</h3>
                  <p className="text-sm text-gray-500">We come to you in Kaduna</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-[#e8ddd4]">
                  <i className="fas fa-star text-2xl text-[#D4AF37] mb-3"></i>
                  <h3 className="font-semibold mb-1">5-Star Rated</h3>
                  <p className="text-sm text-gray-500">Trusted by hundreds of clients</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <img
                src="/hennah/images/designs.jpg"
                alt="Henna design artwork"
                className="rounded-3xl shadow-2xl border-4 border-white"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center text-[#D4AF37] text-xl">
                  <i className="fas fa-award"></i>
                </div>
                <div>
                  <p className="font-semibold text-sm">Premium Quality</p>
                  <p className="text-xs text-gray-500">Since day one</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutPage