import React, { useState } from 'react';
import styles from '../components/css/Blog.module.css';

const Blog = () => {
  // Posts simulados con Lorem Ipsum
  const [posts] = useState([
    {
      id: 1,
      title: 'Cómo Cultivar Tomates en Casa',
      author: 'María García',
      date: '15 de Noviembre, 2024',
      category: 'Cultivo',
      image: 'https://via.placeholder.com/600x400?text=Tomates',
      excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`
    },
    {
      id: 2,
      title: 'Beneficios de la Agricultura Sostenible',
      author: 'Juan López',
      date: '10 de Noviembre, 2024',
      category: 'Sostenibilidad',
      image: 'https://via.placeholder.com/600x400?text=Sostenibilidad',
      excerpt: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.',
      content: `Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.

Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut quid ex ea commodi consequatur.`
    },
    {
      id: 3,
      title: 'Plagas Comunes en el Huerto y Cómo Prevenirlas',
      author: 'Sofia Martínez',
      date: '5 de Noviembre, 2024',
      category: 'Plagas',
      image: 'https://via.placeholder.com/600x400?text=Plagas',
      excerpt: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.',
      content: `At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.

Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.

Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.`
    },
    {
      id: 4,
      title: 'Cosecha de Frutas: Guía Completa',
      author: 'Pedro Rodríguez',
      date: '1 de Noviembre, 2024',
      category: 'Cosecha',
      image: 'https://via.placeholder.com/600x400?text=Cosecha',
      excerpt: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint.',
      content: `Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae itaque earum rerum hic tenetur a sapiente delectus.

Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.

Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`
    },
    {
      id: 5,
      title: 'Técnicas Innovadoras de Riego',
      author: 'Laura Chen',
      date: '25 de Octubre, 2024',
      category: 'Riego',
      image: 'https://via.placeholder.com/600x400?text=Riego',
      excerpt: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur vel illum.',
      content: `Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident similique sunt.

In culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga et harum quidem rerum facilis est et expedita distinctio.`
    }
  ]);

  const [selectedPost, setSelectedPost] = useState(null);
  const [filter, setFilter] = useState('todos');

  // Filtrar posts por categoría
  const filteredPosts = filter === 'todos' 
    ? posts 
    : posts.filter(post => post.category === filter);

  const categories = ['todos', ...new Set(posts.map(p => p.category))];

  return (
    <div className={styles.blogContainer}>
      {/* Hero Section */}
      <section className={styles.blogHero}>
        <h1>🌱 Blog Seeds to Roots</h1>
        <p>Consejos, guías y historias sobre agricultura sostenible</p>
      </section>

      {/* Navigation Bar - Estilo Header Verde */}
      <section className={styles.navBar}>
        <nav>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/productos">Productos</a></li>
            <li><a href="/carrito">Carrito</a></li>
          </ul>
        </nav>
      </section>

      {selectedPost ? (
        // Vista de Artículo Individual
        <section className={styles.blogDetail}>
          <button className={styles.btnBack} onClick={() => setSelectedPost(null)}>
            ← Volver al Blog
          </button>
          
          <article className={styles.postDetail}>
            <img src={selectedPost.image} alt={selectedPost.title} className={styles.postImage} />
            
            <div className={styles.postHeader}>
              <h1>{selectedPost.title}</h1>
              <div className={styles.postMeta}>
                <span className={styles.author}>✍️ {selectedPost.author}</span>
                <span className={styles.date}>📅 {selectedPost.date}</span>
                <span className={styles.category}>📂 {selectedPost.category}</span>
              </div>
            </div>

            <div className={styles.postContent}>
              {selectedPost.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className={styles.postFooter}>
              <button className={styles.btnShare}>Compartir</button>
              <button className={styles.btnComment}>Comentar</button>
            </div>
          </article>
        </section>
      ) : (
        // Vista de Lista de Posts
        <section className={styles.blogList}>
          {/* Filtros */}
          <div className={styles.filterSection}>
            <h3>Categorías</h3>
            <div className={styles.filterButtons}>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`${styles.filterBtn} ${filter === cat ? styles.active : ''}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Posts */}
          <div className={styles.postsGrid}>
            {filteredPosts.map(post => (
              <article key={post.id} className={styles.postCard}>
                <img src={post.image} alt={post.title} className={styles.postImage} />
                
                <div className={styles.postInfo}>
                  <span className={styles.postCategory}>{post.category}</span>
                  <h2>{post.title}</h2>
                  
                  <p className={styles.postExcerpt}>{post.excerpt}</p>
                  
                  <div className={styles.postFooterCard}>
                    <div className={styles.postMetaCard}>
                      <span className={styles.authorSmall}>{post.author}</span>
                      <span className={styles.dateSmall}>{post.date}</span>
                    </div>
                    <button 
                      className={styles.btnReadMore}
                      onClick={() => setSelectedPost(post)}
                    >
                      Leer más →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <p className={styles.noPosts}>No hay posts en esta categoría.</p>
          )}
        </section>
      )}
    </div>
  );
};

export default Blog;