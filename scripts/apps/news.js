/**
 * News Reader App (Mock RSS)
 */

const NewsApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        return () => {};
    },

    render() {
        const news = [
            { title: "HTML Hub version 2.0 released!", desc: "The ultimate personal dashboard gets a massive update with 50+ tools.", category: "Tech", date: "Today" },
            { title: "Web development trends 2026", desc: "Why local-first applications and PWA are dominating the industry.", category: "Dev", date: "Yesterday" },
            { title: "Vanilla JS vs Frameworks", desc: "Is React still necessary in 2026? Developers weigh in.", category: "Trends", date: "2 days ago" },
            { title: "Personal Productivity Tips", desc: "How to use your HTML Hub to maximize daily efficiency.", category: "Efficiency", date: "3 days ago" }
        ];

        this.container.innerHTML = `
            <div class="news-app">
                <div class="news-categories">
                    <span class="badge active">Top Stories</span>
                    <span class="badge">Tech</span>
                    <span class="badge">Science</span>
                </div>
                <div class="news-list">
                    ${news.map(item => `
                        <div class="news-item">
                            <div class="news-meta">
                                <span class="news-cat">${item.category}</span>
                                <span class="news-date">${item.date}</span>
                            </div>
                            <h3>${item.title}</h3>
                            <p>${item.desc}</p>
                            <button class="read-more">Read More <i class="fas fa-arrow-right"></i></button>
                        </div>
                    `).join('')}
                </div>
            </div>
            <style>
                .news-app { padding: 15px; }
                .news-categories { display: flex; gap: 10px; margin-bottom: 20px; }
                .badge { padding: 5px 12px; border-radius: 15px; background: rgba(0,0,0,0.05); font-size: 0.8rem; cursor: pointer; }
                .badge.active { background: var(--accent-color); color: white; }
                .news-item { background: rgba(0,0,0,0.03); padding: 15px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid var(--accent-color); }
                .news-meta { display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 8px; opacity: 0.6; }
                .news-item h3 { font-size: 1rem; margin-bottom: 8px; }
                .news-item p { font-size: 0.9rem; opacity: 0.8; line-height: 1.4; margin-bottom: 12px; }
                .read-more { background: none; border: none; color: var(--accent-color); font-weight: bold; cursor: pointer; font-size: 0.85rem; padding: 0; }
            </style>
        `;
    }
};
