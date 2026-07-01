(function () {
  const root = document.documentElement;
  const body = document.body;

  function initTheme() {
    // 优先使用用户保存的主题，否则跟随系统
    const saved = localStorage.getItem('paperdaily-theme');
    if (saved) {
      applyTheme(saved);
    } else {
      // 设计系统默认呈现日报纸张感，主题切换后再记住用户选择。
      applyTheme('light');
    }

    // 监听系统主题变化（仅当用户未手动设置时）
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const saved = localStorage.getItem('paperdaily-theme');
      if (!saved) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });

    const themeToggles = document.querySelectorAll('#themeToggle, [data-theme-toggle]');
    themeToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
        applyTheme(next);
      });
    });
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem('paperdaily-theme', theme);
    updateThemeColor(theme);
  }

  function updateThemeColor(theme) {
    // 更新 theme-color meta 标签（手机 Chrome 地址栏颜色）
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const color = theme === 'dark' ? '#17282E' : '#F7F7F5';
      metaThemeColor.setAttribute('content', color);
    }
  }

  function initFontSize() {
    const saved = localStorage.getItem('paperdaily-font-size') || 'medium';
    applyFontSize(saved);

    const buttons = document.querySelectorAll('.font-size-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const size = btn.dataset.fontSize;
        applyFontSize(size);
      });
    });
  }

  function applyFontSize(size) {
    root.dataset.fontSize = size;
    localStorage.setItem('paperdaily-font-size', size);
    document.querySelectorAll('.font-size-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.fontSize === size);
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navbarHeight = parseInt(getComputedStyle(root).getPropertyValue('--navbar-height')) || 60;
          const offset = navbarHeight + 16;
          const pos = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: pos, behavior: 'smooth' });
        }
      });
    });
  }

  function initScrollSpy() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    if (!navLinks.length) return;

    const sections = [];
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const el = document.querySelector(href);
        if (el) sections.push({ id: href.slice(1), el, link });
      }
    });

    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sections.forEach(s => {
            s.link.classList.toggle('is-active', s.el === entry.target);
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0.1 });

    sections.forEach(s => observer.observe(s.el));
  }

  function initBookmarkButtons() {
    document.querySelectorAll('[data-bookmark]').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('is-saved');
        const icon = btn.querySelector('i');
        if (icon) {
          if (btn.classList.contains('is-saved')) {
            icon.classList.remove('ph');
            icon.classList.add('ph-fill');
          } else {
            icon.classList.remove('ph-fill');
            icon.classList.add('ph');
          }
        }
      });
    });
  }

  function initPageTabs() {
    document.querySelectorAll('[data-tabs-demo]').forEach(tabsContainer => {
      const btns = tabsContainer.querySelectorAll('[data-tab-btn]');
      const panels = tabsContainer.querySelectorAll('[data-tab-panel]');

      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.tabBtn;
          btns.forEach(b => b.classList.remove('is-active'));
          panels.forEach(p => p.classList.remove('is-active'));
          btn.classList.add('is-active');
          const panel = tabsContainer.querySelector(`[data-tab-panel="${target}"]`);
          if (panel) panel.classList.add('is-active');
        });
      });
    });

    const pageDemoTabs = document.querySelectorAll('.page-demo-tabs');
    pageDemoTabs.forEach(tabGroup => {
      const tabs = tabGroup.querySelectorAll('.page-tab');
      const section = tabGroup.closest('.doc-section');
      if (!section) return;
      const frames = section.querySelectorAll('.page-demo-frame');

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const target = tab.dataset.pageDemo;
          tabs.forEach(t => t.classList.remove('is-active'));
          frames.forEach(f => f.classList.remove('is-active'));
          tab.classList.add('is-active');
          const frame = section.querySelector(`[data-page-panel="${target}"]`);
          if (frame) frame.classList.add('is-active');
        });
      });
    });
  }

  function initPaperCardStates() {
    const demoBoxes = document.querySelectorAll('.demo-box');
    demoBoxes.forEach(box => {
      const stateBtns = box.querySelectorAll('[data-paper-state]');
      const card = box.querySelector('.paper-card-demo');
      if (!stateBtns.length || !card) return;

      stateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const state = btn.dataset.paperState;
          stateBtns.forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');

          card.classList.remove('is-read', 'is-saved', 'is-muted');
          if (state === 'read') card.classList.add('is-muted');
          if (state === 'saved') {
            card.classList.add('is-saved');
            const bookmarkBtn = card.querySelector('[data-bookmark]');
            if (bookmarkBtn) bookmarkBtn.classList.add('is-saved');
          }
        });
      });
    });
  }

  function initSummaryModes() {
    const demoBoxes = document.querySelectorAll('.demo-box');
    demoBoxes.forEach(box => {
      const modeBtns = box.querySelectorAll('[data-summary-mode]');
      const summaryBlock = box.querySelector('.summary-block');
      const summaryText = box.querySelector('[data-summary-text]');
      if (!modeBtns.length || !summaryBlock || !summaryText) return;

      const briefText = summaryText.textContent;
      const detailText = summaryText.dataset.detail || '推理表现的上升趋势变得可估计，这会改变训练预算和评估计划的制定方式。研究团队在 10B 到 100B 参数范围内进行了系统实验，发现数据质量和模型规模的协同效应可以用一个简洁的幂律函数描述。';

      modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const mode = btn.dataset.summaryMode;
          modeBtns.forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');

          summaryText.textContent = mode === 'brief' ? briefText : detailText;
        });
      });
    });
  }

  function initCommandBar() {
    const overlay = document.getElementById('commandOverlay');
    const openBtn = document.getElementById('commandOpenButton');
    const closeBtn = document.getElementById('commandCloseButton');
    const input = document.getElementById('commandInput');
    const results = document.getElementById('commandResults');
    if (!overlay || !openBtn || !closeBtn || !input || !results) return;

    function open() {
      overlay.classList.remove('hidden');
      setTimeout(() => input.focus(), 50);
    }

    function close() {
      overlay.classList.add('hidden');
      input.value = '';
    }

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (overlay.classList.contains('hidden')) {
          open();
        } else {
          close();
        }
      }
      if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
        close();
      }
    });

    results.querySelectorAll('button[data-command-target]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.commandTarget;
        close();
        setTimeout(() => {
          const el = document.querySelector(target);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      });
    });

    const resultButtons = Array.from(results.querySelectorAll('button[data-command-target]'));
    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      resultButtons.forEach(btn => {
        const label = btn.textContent.trim().toLowerCase();
        btn.hidden = query.length > 0 && !label.includes(query);
      });
    });
  }

  function initBottomSheet() {
    const overlay = document.getElementById('sheetOverlay');
    const openBtn = document.getElementById('sheetOpenButton');
    const closeBtn = document.getElementById('sheetCloseButton');
    if (!overlay || !openBtn || !closeBtn) return;

    function open() {
      overlay.classList.remove('hidden');
    }

    function close() {
      overlay.classList.add('hidden');
    }

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
        close();
      }
    });
  }

  function initCitationToggle() {
    const toggle = document.getElementById('citationToggle');
    const list = document.getElementById('citationList');
    if (!toggle || !list) return;

    function updateToggleText() {
      if (typeof i18next === 'undefined') return;
      const isHidden = list.hasAttribute('hidden');
      toggle.textContent = isHidden
        ? i18next.t('docs.toggleCitation')
        : i18next.t('docs.toggleCitationHide');
    }

    toggle.addEventListener('click', () => {
      const isHidden = list.hasAttribute('hidden');
      if (isHidden) {
        list.removeAttribute('hidden');
      } else {
        list.setAttribute('hidden', '');
      }
      updateToggleText();
    });

    updateToggleText();
  }

  function initSidebarToggle() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('docsSidebar');
    if (!toggleBtn || !sidebar) return;

    toggleBtn.addEventListener('click', () => {
      const isOpen = sidebar.classList.contains('is-open');
      sidebar.classList.toggle('is-open');
      toggleBtn.setAttribute('aria-expanded', !isOpen);
    });

    document.addEventListener('click', (e) => {
      if (window.innerWidth > 1024) return;
      if (!sidebar.classList.contains('is-open')) return;
      if (sidebar.contains(e.target) || toggleBtn.contains(e.target)) return;
      sidebar.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  }

  function initSettingsToggle() {
    const toggleBtn = document.getElementById('settingsToggle');
    const panel = document.getElementById('toolbarSettings');
    if (!toggleBtn || !panel) return;

    function close() {
      panel.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }

    toggleBtn.addEventListener('click', () => {
      const isOpen = panel.classList.toggle('is-open');
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!panel.classList.contains('is-open')) return;
      if (panel.contains(e.target) || toggleBtn.contains(e.target)) return;
      close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }

  function initSidebarFilter() {
    const input = document.getElementById('sidebarFilter');
    const sidebar = document.getElementById('docsSidebar');
    if (!input || !sidebar) return;

    input.addEventListener('input', () => {
      const query = input.value.toLowerCase();
      const groups = sidebar.querySelectorAll('[data-nav-group]');
      const items = sidebar.querySelectorAll('[data-nav-item]');

      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        const matches = text.includes(query);
        item.style.display = matches ? '' : 'none';
      });

      groups.forEach(group => {
        const visibleItems = group.querySelectorAll('[data-nav-item]:not([style*="display: none"])');
        group.style.display = visibleItems.length > 0 ? '' : 'none';
        if (query && visibleItems.length > 0) {
          group.setAttribute('open', '');
        }
      });
    });
  }

  function initDocNavActiveState() {
    const navItems = document.querySelectorAll('[data-nav-item]');
    if (!navItems.length) return;

    const sections = [];
    navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href && href.startsWith('#')) {
        const el = document.querySelector(href);
        if (el) sections.push({ id: href.slice(1), el, item });
      }
    });

    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sections.forEach(s => {
            s.item.classList.toggle('is-active', s.el === entry.target);
          });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0.1 });

    sections.forEach(s => observer.observe(s.el));
  }

  function initI18n() {
    if (typeof i18next === 'undefined') return;

    const languageSelect = document.getElementById('languageSelect');

    i18next
      .use(i18nextHttpBackend)
      .use(i18nextBrowserLanguageDetector)
      .init({
        fallbackLng: 'zh',
        lng: 'zh',
        backend: {
          loadPath: 'locales/{{lng}}/common.json'
        },
        interpolation: {
          escapeValue: false
        }
      }, function(err, t) {
        updateContent();
        if (languageSelect) {
          languageSelect.value = i18next.language || 'zh';
        }
      });

    function updateContent() {
      const currentYear = new Date().getFullYear();

      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = i18next.t(key, { year: currentYear });
      });

      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.setAttribute('placeholder', i18next.t(key, { year: currentYear }));
      });

      document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria-label');
        el.setAttribute('aria-label', i18next.t(key, { year: currentYear }));
      });

      document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        el.setAttribute('title', i18next.t(key, { year: currentYear }));
      });

      const pageTitle = i18next.t('landing.pageTitle', { fallbackValue: document.title });
      if (pageTitle !== document.title) document.title = pageTitle;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        const descValue = i18next.t('landing.pageDescription', { fallbackValue: metaDesc.getAttribute('content') });
        metaDesc.setAttribute('content', descValue);
      }
    }

    if (languageSelect) {
      languageSelect.addEventListener('change', (e) => {
        i18next.changeLanguage(e.target.value, () => {
          updateContent();
          document.documentElement.lang = e.target.value;
          document.documentElement.dir = e.target.value === 'ar' ? 'rtl' : 'ltr';
        });
      });
    }
  }

  function initPagePreview() {
    const overlay = document.getElementById('pagePreviewOverlay');
    const panel = document.getElementById('pagePreviewPanel');
    const closeBtn = document.getElementById('pagePreviewClose');
    const titleEl = document.getElementById('pagePreviewTitle');
    const subtitleEl = document.getElementById('pagePreviewSubtitle');
    const bodyEl = document.getElementById('pagePreviewBody');

    if (!overlay || !panel) return;

    function pt(key, fallback) {
      if (typeof i18next !== 'undefined') {
        return i18next.t('docs.preview.' + key, { fallbackValue: fallback });
      }
      return fallback;
    }

    function getPageTemplates() {
      return {
      'mobile-feed': {
        title: 'Daily Papers',
        subtitle: pt('mobileFeedSubtitle', '首页信息流 · 移动端'),
        device: 'mobile',
        hasNotch: true,
        hasNavBar: true,
        activeNav: 'home',
        content: `
          <div class="mini-app-header">
            <div>
              <h4>${pt('todayBriefing', '今日简报')}</h4>
              <div class="date-text">October 24, 2026</div>
            </div>
            <div class="mini-app-header-actions">
              <div class="mini-icon-btn"><i class="ph ph-sliders"></i></div>
              <div class="mini-icon-btn"><i class="ph ph-dots-three-circle"></i></div>
            </div>
          </div>
          <div class="mini-paper-card">
            <div class="mini-rank">01</div>
            <div class="mini-paper-body">
              <div class="mini-paper-source"><span class="mini-paper-source-dot"></span>Nature · Medicine</div>
              <div class="mini-paper-title">A safer gene switch for cell therapies</div>
              <div class="mini-paper-desc">${pt('paperDesc1', '精确控制治疗开关，提升临床安全性。')}</div>
            </div>
            <div class="mini-bookmark"><i class="ph ph-bookmark-simple"></i></div>
          </div>
          <div class="mini-paper-card">
            <div class="mini-rank">02</div>
            <div class="mini-paper-body">
              <div class="mini-paper-source"><span class="mini-paper-source-dot"></span>ArXiv AI</div>
              <div class="mini-paper-title">A new scaling law for reasoning in large language models</div>
              <div class="mini-paper-desc">${pt('paperDesc2', '模型推理能力的提升规律变得可估。')}</div>
            </div>
            <div class="mini-bookmark"><i class="ph ph-bookmark-simple"></i></div>
          </div>
          <div class="mini-paper-card">
            <div class="mini-rank">03</div>
            <div class="mini-paper-body">
              <div class="mini-paper-source"><span class="mini-paper-source-dot"></span>Science · Earth</div>
              <div class="mini-paper-title">Global methane emissions are higher and rising faster</div>
              <div class="mini-paper-desc">${pt('paperDesc3', '卫星观测揭示甲烷排放增长超预期。')}</div>
            </div>
            <div class="mini-bookmark"><i class="ph ph-bookmark-simple"></i></div>
          </div>
          <div class="mini-paper-card">
            <div class="mini-rank">04</div>
            <div class="mini-paper-body">
              <div class="mini-paper-source"><span class="mini-paper-source-dot"></span>Cell</div>
              <div class="mini-paper-title">Reversing epigenetic aging in human cells</div>
              <div class="mini-paper-desc">${pt('paperDesc4', '重编程里程碑：逆转衰老时钟。')}</div>
            </div>
            <div class="mini-bookmark"><i class="ph ph-bookmark-simple"></i></div>
          </div>
        `
      },
      'mobile-reader': {
        title: 'Paper Reader',
        subtitle: pt('mobileReaderSubtitle', '论文详情页 · 移动端'),
        device: 'mobile',
        hasNotch: true,
        hasNavBar: false,
        content: `
          <div class="mini-app-header">
            <div class="mini-app-header-actions">
              <div class="mini-icon-btn"><i class="ph ph-caret-left"></i></div>
            </div>
            <div class="mini-app-header-actions">
              <div class="mini-icon-btn"><i class="ph ph-star"></i></div>
              <div class="mini-icon-btn"><i class="ph ph-dots-three-circle"></i></div>
            </div>
          </div>
          <div style="padding: 0 var(--space-md);">
            <div class="mini-paper-source" style="margin-bottom: var(--space-xs);">ArXiv AI · June 25, 2026 · 12 min read</div>
            <h4 style="font-size: 16px; font-weight: 700; line-height: 1.35; margin-bottom: var(--space-sm); color: var(--ink);">A new scaling law for reasoning in large language models</h4>
          </div>
          <div class="mini-key-finding">
            <div class="mini-key-finding-label"><i class="ph-fill ph-key"></i> Key Finding</div>
            <p>${pt('mobileReaderKeyFinding', '大型语言模型的推理能力会随着更多计算和更高质量数据增长，增强规律是可预测的。')}</p>
          </div>
          <div class="mini-plain-english">
            <strong>In Plain English</strong>
            <ul>
              <li>${pt('mobileReaderPlain1', '更大的模型推理能力更好。')}</li>
              <li>${pt('mobileReaderPlain2', '关系是可预测的。')}</li>
              <li>${pt('mobileReaderPlain3', '数据质量很重要。高质量数据推理提升更多。')}</li>
              <li>${pt('mobileReaderPlain4', '对规划训练预算和评估里程碑有实际意义。')}</li>
            </ul>
          </div>
          <div class="mini-cta-row">
            <div class="mini-btn-outline">Read Original</div>
            <div class="mini-btn-primary">Next Paper →</div>
          </div>
        `
      },
      'mobile-dashboard': {
        title: 'Data Dashboard',
        subtitle: pt('mobileDashboardSubtitle', '数据面板 · 移动端'),
        device: 'mobile',
        hasNotch: true,
        hasNavBar: true,
        activeNav: 'stats',
        content: `
          <div class="mini-app-header">
            <div>
              <h4>${pt('mobileDashboardTitle', '数据面板')}</h4>
              <div class="date-text">${pt('mobileDashboardOverview', '总览')}</div>
            </div>
            <div class="mini-app-header-actions">
              <div class="mini-icon-btn"><i class="ph ph-arrows-clockwise"></i></div>
            </div>
          </div>
          <div style="padding: 0 var(--space-md); margin-bottom: var(--space-xs);">
            <select style="width: 100%; height: 32px; border: 1px solid var(--line); border-radius: var(--radius-md); background: var(--surface); font-size: 11px; padding: 0 var(--space-sm); color: var(--ink-soft);">
              <option>${pt('mobileDashboardDate', '2026-06-25（周四）')}</option>
            </select>
          </div>
          <div class="mini-dashboard-stats">
            <div class="mini-stat-card">
              <div class="stat-icon"><i class="ph ph-file-text"></i></div>
              <div class="stat-value">78</div>
              <div class="stat-label">${pt('mobileDashboardStatPapers', '论文数量')}</div>
            </div>
            <div class="mini-stat-card">
              <div class="stat-icon"><i class="ph ph-calendar"></i></div>
              <div class="stat-value">12</div>
              <div class="stat-label">${pt('mobileDashboardStatDays', '日期范围')}</div>
            </div>
            <div class="mini-stat-card">
              <div class="stat-icon"><i class="ph ph-hash"></i></div>
              <div class="stat-value">790</div>
              <div class="stat-label">${pt('mobileDashboardStatKeywords', '唯一关键词')}</div>
            </div>
            <div class="mini-stat-card">
              <div class="stat-icon"><i class="ph ph-users"></i></div>
              <div class="stat-value">453</div>
              <div class="stat-label">${pt('mobileDashboardStatAuthors', '唯一作者')}</div>
            </div>
          </div>
          <div class="mini-topics-list">
            <h5>${pt('mobileDashboardTopicsTitle', '关键词统计')}</h5>
            <div class="mini-topic-item">
              <span>physics.optics</span>
              <span class="topic-count">${pt('mobileDashboardTimes', '78 次')}</span>
            </div>
            <div class="mini-topic-item">
              <span>optical</span>
              <span class="topic-count">${pt('mobileDashboardTimes2', '17 次')}</span>
            </div>
            <div class="mini-topic-item">
              <span>physics.app-ph</span>
              <span class="topic-count">${pt('mobileDashboardTimes3', '8 次')}</span>
            </div>
            <div class="mini-topic-item">
              <span>photonic</span>
              <span class="topic-count">${pt('mobileDashboardTimes4', '6 次')}</span>
            </div>
            <div class="mini-topic-item">
              <span>cond-mat.mtrl-sci</span>
              <span class="topic-count">${pt('mobileDashboardTimes5', '6 次')}</span>
            </div>
          </div>
        `
      },
      'mobile-saved': {
        title: 'Saved Papers',
        subtitle: pt('mobileSavedSubtitle', '收藏夹 · 移动端'),
        device: 'mobile',
        hasNotch: true,
        hasNavBar: true,
        activeNav: 'saved',
        content: `
          <div class="mini-app-header">
            <div>
              <h4>${pt('mobileSavedTitle', '收藏')}</h4>
            </div>
            <div class="mini-app-header-actions">
              <div class="mini-icon-btn"><i class="ph ph-funnel"></i></div>
            </div>
          </div>
          <div class="mini-paper-card">
            <div class="mini-rank" style="color: var(--amber-500);">★</div>
            <div class="mini-paper-body">
              <div class="mini-paper-source"><span class="mini-paper-source-dot"></span>Physical Review</div>
              <div class="mini-paper-title">A Langevin Model-Based Magneto-Optic Response Superparamagnetic Nanoparticles Recorded with a Michelson Interferometer Setup</div>
              <div class="mini-paper-desc">${pt('mobileSavedDesc1', '本文为溶液中超顺磁性纳米颗粒的磁光表征提供了理论框架和实验方法，分析了迈克尔逊干涉仪中的干。')}</div>
            </div>
            <div class="mini-bookmark"><i class="ph-fill ph-star" style="color: var(--amber-500);"></i></div>
          </div>
          <div class="mini-paper-card">
            <div class="mini-rank" style="color: var(--amber-500);">★</div>
            <div class="mini-paper-body">
              <div class="mini-paper-source"><span class="mini-paper-source-dot"></span>Nature Photonics</div>
              <div class="mini-paper-title">A laser with instability reaching $4×10^-17$ based on a silicon cavity at sub-5 K temperatures</div>
              <div class="mini-paper-desc">${pt('mobileSavedDesc2', '通过第一层原理研究元素金属中的体等离激元光学特性。')}</div>
            </div>
            <div class="mini-bookmark"><i class="ph-fill ph-star" style="color: var(--amber-500);"></i></div>
          </div>
          <div class="mini-paper-card">
            <div class="mini-rank" style="color: var(--amber-500);">★</div>
            <div class="mini-paper-body">
              <div class="mini-paper-source"><span class="mini-paper-source-dot"></span>Science Advances</div>
              <div class="mini-paper-title">Bulk plasmons in elemental metals</div>
              <div class="mini-paper-desc">${pt('mobileSavedDesc3', '通过第一层原理研究元素金属中的体等离激元光学特性。')}</div>
            </div>
            <div class="mini-bookmark"><i class="ph-fill ph-star" style="color: var(--amber-500);"></i></div>
          </div>
        `
      },
      'desktop-feed': {
        title: 'Desktop Feed',
        subtitle: pt('desktopFeedSubtitle', '三栏信息流 · Web'),
        device: 'desktop',
        content: `
          <div class="mini-desktop-shell">
            <div class="mini-desktop-sidebar">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px; padding: 0 4px;">
                <div style="width: 28px; height: 28px; background: var(--brand); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 12px;">S</div>
                <div style="font-size: 13px; font-weight: 700; color: var(--ink);">ScholarDaily</div>
              </div>
              <div style="font-size: 10px; font-weight: 600; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; padding: 0 4px;">${pt('desktopFeedChannels', '研究频道')}</div>
              <div class="mini-desktop-nav-item is-active"><i class="ph ph-sparkle"></i> ${pt('desktopFeedNavToday', '今日简报')}</div>
              <div class="mini-desktop-nav-item"><i class="ph ph-brain"></i> AI / LLM</div>
              <div class="mini-desktop-nav-item"><i class="ph ph-atom"></i> Physics</div>
              <div class="mini-desktop-nav-item"><i class="ph ph-dna"></i> Bio Medicine</div>
              <div class="mini-desktop-nav-item"><i class="ph ph-bookmark-simple"></i> ${pt('desktopFeedNavReadLater', '稍后读')}</div>
              <div class="mini-desktop-nav-item"><i class="ph ph-binoculars"></i> ${pt('desktopFeedNavCollections', '收藏专题')}</div>
            </div>
            <div class="mini-desktop-feed">
              <div style="margin-bottom: 16px;">
                <div style="font-size: 20px; font-weight: 700; color: var(--ink); margin-bottom: 4px;">Daily Papers</div>
                <div style="font-size: 11px; color: var(--ink-muted);">${pt('desktopFeedSubtitleText', '为你精选：AI / LLM、AI safety、multimodal learning')}</div>
              </div>
              <div style="display: flex; flex-direction: column; gap: 2px;">
                <div class="mini-paper-card" style="border: 1px solid var(--line-soft); border-radius: 12px; padding: 12px 14px; background: var(--paper);">
                  <div class="mini-rank" style="background: var(--ink); color: var(--paper); width: 24px; height: 24px; font-size: 10px;">★</div>
                  <div class="mini-paper-body">
                    <div class="mini-paper-source" style="font-size: 10px;"><span class="mini-paper-source-dot"></span>ArXiv AI · ${pt('desktopFeedBecauseSaved', '因为你收藏了 reasoning')}</div>
                    <div class="mini-paper-title" style="font-size: 12px;">A new scaling law for reasoning in large language models</div>
                    <div class="mini-paper-desc" style="font-size: 11px;">${pt('desktopFeedDesc1', '模型推理能力提升规律变得可预测，改变训练预算规划方式。')}</div>
                  </div>
                  <div class="mini-bookmark"><i class="ph-fill ph-star" style="color: var(--amber-500);"></i></div>
                </div>
                <div class="mini-paper-card" style="border: 1px solid transparent; border-radius: 12px; padding: 12px 14px; background: transparent;">
                  <div class="mini-rank" style="color: var(--ink-muted);">02</div>
                  <div class="mini-paper-body">
                    <div class="mini-paper-source" style="font-size: 10px;"><span class="mini-paper-source-dot"></span>Nature</div>
                    <div class="mini-paper-title" style="font-size: 12px;">A reversible gene switch for safer cell therapies</div>
                    <div class="mini-paper-desc" style="font-size: 11px;">${pt('desktopFeedDesc2', '精确控制治疗开关，提升临床安全性。')}</div>
                  </div>
                  <div class="mini-bookmark"><i class="ph ph-bookmark-simple"></i></div>
                </div>
                <div class="mini-paper-card" style="border: 1px solid transparent; border-radius: 12px; padding: 12px 14px; background: transparent;">
                  <div class="mini-rank" style="color: var(--ink-muted);">03</div>
                  <div class="mini-paper-body">
                    <div class="mini-paper-source" style="font-size: 10px;"><span class="mini-paper-source-dot"></span>Science</div>
                    <div class="mini-paper-title" style="font-size: 12px;">Global methane emissions higher than thought</div>
                    <div class="mini-paper-desc" style="font-size: 11px;">卫星观测揭示甲烷排放增长超预期。</div>
                  </div>
                  <div class="mini-bookmark"><i class="ph ph-bookmark-simple"></i></div>
                </div>
              </div>
            </div>
            <div class="mini-desktop-detail">
              <div style="font-size: 10px; font-weight: 600; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;"><i class="ph-fill ph-sparkle" style="color: var(--violet);"></i> ${pt('desktopFeedKeyFinding', '关键发现')}</div>
              <p style="font-size: 12px; line-height: 1.6; color: var(--ink-soft); margin-bottom: 16px;">${pt('desktopFeedKeyFindingDesc', '推理能力提升曲线可估 → 训练预算规划方式改变。')}</p>
              <div style="font-size: 10px; font-weight: 600; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Plain English</div>
              <p style="font-size: 12px; line-height: 1.6; color: var(--ink-soft);">${pt('desktopFeedPlainEnglish', '更大模型 + 更好数据 = 推理能力稳定提升。')}</p>
            </div>
          </div>
        `
      },
      'desktop-auth': {
        title: 'Split Auth',
        subtitle: pt('desktopAuthSubtitle', 'Web 登录页'),
        device: 'desktop',
        content: `
          <div class="mini-split-auth">
            <div class="mini-split-left">
              <div style="margin-bottom: var(--space-md);">
                <div style="width: 32px; height: 32px; background: var(--brand); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 14px;">S</div>
              </div>
              <h3>${pt('desktopAuthHeadline', '把论文推荐系统，调成你的研究口味。')}</h3>
              <p>${pt('desktopAuthDesc', '登录后同步收藏、阅读进度、关键词偏好和推荐反馈。桌面端高效整理，移动端轻松阅读。')}</p>
              <div class="mini-split-card">
                <div class="mini-split-card-icon"><i class="ph ph-newspaper"></i></div>
                <div class="mini-split-card-text">
                  <strong>Today Briefing</strong>
                  <span>5 top papers, summarized for your taste.</span>
                </div>
              </div>
            </div>
            <div class="mini-split-right">
              <h4>${pt('desktopAuthLoginTitle', '登录 ScholarDaily')}</h4>
              <p>${pt('desktopAuthLoginSubtitle', '继续你的收藏、推荐画像和阅读进度。')}</p>
              <div class="mini-input-group">
                <label>${pt('desktopAuthEmailLabel', '邮箱')}</label>
                <div class="mini-input"></div>
              </div>
              <div class="mini-input-group">
                <label>${pt('desktopAuthPasswordLabel', '密码')}</label>
                <div class="mini-input"></div>
              </div>
              <div class="mini-auth-btn">${pt('desktopAuthLoginBtn', '登录')}</div>
              <div style="text-align: center; margin-top: var(--space-sm); font-size: 10px; color: var(--ink-muted);">
                ${pt('desktopAuthNoAccount', '还没有账号？')}<span style="color: var(--brand);">${pt('desktopAuthCreateAccount', '创建账号')}</span>
              </div>
              <div class="mini-auth-divider"><span>${pt('desktopAuthOr', '或')}</span></div>
              <div class="mini-social-btn"><i class="ph ph-google-logo"></i> ${pt('desktopAuthGoogleLogin', '使用 Google 登录')}</div>
            </div>
          </div>
        `
      },
      'onboarding-welcome': {
        title: 'Welcome',
        subtitle: pt('onboardingWelcomeSubtitle', '欢迎页 · Onboarding 01'),
        device: 'mobile',
        hasNotch: true,
        hasNavBar: false,
        content: `
          <div class="mini-auth-container" style="text-align: left;">
            <div class="mini-auth-logo" style="margin: 0 0 var(--space-md);">S</div>
            <div class="mini-onboarding-title">${pt('onboardingWelcomeTitle', '让论文像信息流一样好读，但仍然可靠')}</div>
            <div class="mini-onboarding-desc">${pt('onboardingWelcomeDesc', '每天 5 到 12 篇高质量论文，先给你白话关键结论，再给原文、作者和可验证来源。')}</div>
            <div style="border: 1px solid var(--line); border-radius: var(--radius-md); padding: var(--space-sm); margin-bottom: var(--space-md); background: var(--surface);">
              <div class="mini-paper-source" style="margin-bottom: 4px;"><span class="mini-paper-source-dot"></span>${pt('onboardingWelcomeTodayBriefing', '今日简报')}</div>
              <div class="mini-paper-title" style="margin-bottom: 4px;">A new scaling law for reasoning in large language models</div>
              <div class="mini-paper-desc">${pt('onboardingWelcomePaperDesc', 'More → reasoning. agent 和摘要的质量也在提升。')}</div>
            </div>
            <div class="mini-auth-btn">${pt('onboardingWelcomeStartBtn', '开始个性化推荐')}</div>
            <div style="text-align: center; margin-top: var(--space-sm); font-size: 10px; color: var(--ink-muted);">
              ${pt('onboardingWelcomeHasAccount', '已有账号，')}<span style="color: var(--brand);">${pt('onboardingWelcomeLogin', '登录')}</span>
            </div>
          </div>
        `
      },
      'onboarding-login': {
        title: 'Login',
        subtitle: pt('onboardingLoginSubtitle', '登录页 · Onboarding 02'),
        device: 'mobile',
        hasNotch: true,
        hasNavBar: false,
        content: `
          <div class="mini-auth-container">
            <div class="mini-auth-logo">S</div>
            <div class="mini-auth-title">${pt('onboardingLoginTitle', '欢迎回来')}</div>
            <div class="mini-auth-subtitle">${pt('onboardingLoginSubtitleText', '继续你的今日论文简报、收藏夹和研读队列。')}</div>
            <div class="mini-input-group">
              <label>${pt('onboardingLoginEmailLabel', '邮箱')}</label>
              <div class="mini-input" style="text-align: left;">researcher@example.com</div>
            </div>
            <div class="mini-input-group">
              <label>${pt('onboardingLoginPasswordLabel', '密码')}</label>
              <div class="mini-input" style="text-align: left;">••••••••</div>
            </div>
            <div class="mini-auth-btn">${pt('onboardingLoginBtn', '登录')}</div>
            <div style="text-align: center; margin-top: var(--space-sm); font-size: 10px; color: var(--ink-muted);">
              ${pt('onboardingLoginNoAccount', '还没有账号？')}<span style="color: var(--brand);">${pt('onboardingLoginCreateAccount', '创建账号')}</span>
            </div>
            <div class="mini-auth-divider"><span>${pt('onboardingLoginOr', '或')}</span></div>
            <div class="mini-social-btn"><i class="ph ph-apple-logo"></i> ${pt('onboardingLoginApple', '使用 Apple 继续')}</div>
            <div class="mini-social-btn"><i class="ph ph-google-logo"></i> ${pt('onboardingLoginGoogle', '使用 Google 继续')}</div>
          </div>
        `
      },
      'onboarding-interests': {
        title: 'Pick Interests',
        subtitle: pt('onboardingInterestsSubtitle', '兴趣选择 · Onboarding 03'),
        device: 'mobile',
        hasNotch: true,
        hasNavBar: false,
        content: `
          <div class="mini-auth-container" style="text-align: left;">
            <div class="mini-step-indicator">1 / 3</div>
            <div class="mini-onboarding-title">${pt('onboardingInterestsTitle', '先选几个你关心的方向')}</div>
            <div class="mini-onboarding-desc">${pt('onboardingInterestsDesc', '不用选很细，后续系统会继续调整。保留"不感兴趣"继续调整。')}</div>
            <div class="mini-interest-tags">
              <div class="mini-interest-tag is-active">LLM</div>
              <div class="mini-interest-tag is-active">Agents</div>
              <div class="mini-interest-tag">AI Safety</div>
              <div class="mini-interest-tag">Multimodal</div>
              <div class="mini-interest-tag">Robotics</div>
              <div class="mini-interest-tag is-active">Biomedicine</div>
              <div class="mini-interest-tag is-active">Physics</div>
              <div class="mini-interest-tag">Climate</div>
              <div class="mini-interest-tag">HCI</div>
              <div class="mini-interest-tag">Neuroscience</div>
              <div class="mini-interest-tag">Materials</div>
            </div>
            <div style="background: var(--surface-muted); border-radius: var(--radius-md); padding: var(--space-sm); margin-bottom: var(--space-md);">
              <div style="font-size: 10px; color: var(--ink-muted); margin-bottom: 4px;">${pt('onboardingInterestsImportHint', '也可以导入你的档案')}</div>
              <div style="font-size: 10px; color: var(--ink-soft);">${pt('onboardingInterestsImportDesc', '粘贴 arXiv、zotero、分类、作者或领域')}</div>
              <div style="font-size: 10px; color: var(--brand); font-weight: 500; margin-top: 4px;">${pt('onboardingInterestsAutoGen', 'BirTech 系统会自动生成初始画像。')}</div>
            </div>
            <div class="mini-auth-btn">${pt('onboardingInterestsContinueBtn', '继续')}</div>
            <div style="text-align: center; margin-top: var(--space-sm); font-size: 10px; color: var(--ink-muted);">
              ${pt('onboardingInterestsSkip', '先跳过，直接看今日的')}
            </div>
          </div>
        `
      },
      'onboarding-notifications': {
        title: 'Notifications',
        subtitle: pt('onboardingNotificationsSubtitle', '通知设置 · Onboarding 04'),
        device: 'mobile',
        hasNotch: true,
        hasNavBar: false,
        content: `
          <div class="mini-auth-container" style="text-align: left;">
            <div class="mini-step-indicator">2 / 3</div>
            <div class="mini-onboarding-title">${pt('onboardingNotificationsTitle', '让提醒像助手，不是打扰。')}</div>
            <div class="mini-onboarding-desc">${pt('onboardingNotificationsDesc', '只在真正有价值时提醒：今日简报、关注作者更新、关键突破推送。关掉得很容易。')}</div>
            <div style="background: var(--surface); border: 1px solid var(--line-soft); border-radius: var(--radius-md); padding: 0 var(--space-sm); margin-bottom: var(--space-md);">
              <div class="mini-toggle-row">
                <div class="mini-toggle-info">
                  <strong>${pt('onboardingNotificationsDaily', '每日简报')}</strong>
                  <span>${pt('onboardingNotificationsDailyDesc', '每天早 8 点，当日 5 篇精选 + 摘要。')}</span>
                </div>
                <div class="mini-toggle is-on"></div>
              </div>
              <div class="mini-toggle-row">
                <div class="mini-toggle-info">
                  <strong>${pt('onboardingNotificationsTrends', '趋势提醒')}</strong>
                  <span>${pt('onboardingNotificationsTrendsDesc', '当某方向出现重要突破时提醒。')}</span>
                </div>
                <div class="mini-toggle is-on"></div>
              </div>
              <div class="mini-toggle-row">
                <div class="mini-toggle-info">
                  <strong>${pt('onboardingNotificationsAuthors', '作者动态')}</strong>
                  <span>${pt('onboardingNotificationsAuthorsDesc', '关注的作者发新论文时提醒。')}</span>
                </div>
                <div class="mini-toggle"></div>
              </div>
              <div class="mini-toggle-row" style="border-bottom: none;">
                <div class="mini-toggle-info">
                  <strong>${pt('onboardingNotificationsWeekly', '周总结')}</strong>
                  <span>${pt('onboardingNotificationsWeeklyDesc', '每周一早上回顾上周研究进展。')}</span>
                </div>
                <div class="mini-toggle is-on"></div>
              </div>
            </div>
            <div class="mini-auth-btn">${pt('onboardingNotificationsSaveBtn', '保存提醒偏好')}</div>
            <div style="text-align: center; margin-top: var(--space-sm); font-size: 10px; color: var(--ink-muted);">
              ${pt('onboardingNotificationsDeny', '不允许通知，只在 App 内显示')}
            </div>
          </div>
        `
      },
      'onboarding-briefing': {
        title: 'First Briefing',
        subtitle: pt('onboardingBriefingSubtitle', '首版日报 · Onboarding 05'),
        device: 'mobile',
        hasNotch: true,
        hasNavBar: false,
        content: `
          <div class="mini-auth-container" style="text-align: left;">
            <div class="mini-step-indicator">3 / 3</div>
            <div class="mini-onboarding-title">${pt('onboardingBriefingTitle', '为你生成的第一版日报')}</div>
            <div class="mini-onboarding-desc">${pt('onboardingBriefingDesc', '基于 4 个兴趣方向和 3 次投票校准，先给你一个可感受的基础。')}</div>
            <div style="background: var(--brand-soft); border-radius: var(--radius-md); padding: var(--space-xs) var(--space-sm); display: inline-flex; align-items: center; gap: 4px; font-size: 10px; color: var(--brand); font-weight: 600; margin-bottom: var(--space-sm);">
              <i class="ph-fill ph-sparkle"></i> ${pt('onboardingBriefingBadge', '推荐简报 v0.1')}
            </div>
            <div style="margin-bottom: var(--space-sm);">
              <div class="mini-paper-card" style="padding: var(--space-xs) 0; border: none;">
                <div class="mini-paper-body">
                  <div class="mini-paper-source"><span class="mini-paper-source-dot"></span>ArXiv AI</div>
                  <div class="mini-paper-title">Training language agents to browse papers with persistent memory</div>
                  <div class="mini-paper-desc">${pt('onboardingBriefingDesc1', '像研究员一样持续阅读文献，不是每次都从头来。')}</div>
                </div>
              </div>
            </div>
            <div style="margin-bottom: var(--space-sm);">
              <div class="mini-paper-card" style="padding: var(--space-xs) 0; border: none;">
                <div class="mini-paper-body">
                  <div class="mini-paper-source"><span class="mini-paper-source-dot"></span>ArXiv AI</div>
                  <div class="mini-paper-title">Tool-using agents improve scientific literature review</div>
                  <div class="mini-paper-desc">${pt('onboardingBriefingDesc2', '工具调用型 agent 显著提升综述质量。')}</div>
                </div>
              </div>
            </div>
            <div style="margin-bottom: var(--space-md);">
              <div class="mini-paper-card" style="padding: var(--space-xs) 0; border: none;">
                <div class="mini-paper-body">
                  <div class="mini-paper-source"><span class="mini-paper-source-dot"></span>Nature Photonics</div>
                  <div class="mini-paper-title">Quantum emitters meet integrated photonics</div>
                  <div class="mini-paper-desc">${pt('onboardingBriefingDesc3', '量子发射器与集成光子学的融合进入新阶段。')}</div>
                </div>
              </div>
            </div>
            <div class="mini-auth-btn">${pt('onboardingBriefingStartBtn', '开启今日阅读')}</div>
          </div>
        `
      },
      'onboarding-register': {
        title: 'Register',
        subtitle: pt('onboardingRegisterSubtitle', '注册页 · Auth 03'),
        device: 'mobile',
        hasNotch: true,
        hasNavBar: false,
        content: `
          <div class="mini-auth-container" style="text-align: left;">
            <div class="mini-auth-logo" style="margin: 0 0 var(--space-md);">S</div>
            <div class="mini-onboarding-title">${pt('onboardingRegisterTitle', '创建你的研究口味')}</div>
            <div class="mini-onboarding-desc">${pt('onboardingRegisterDesc', '我们只问必要的信息，真正的偏好会在你使用时慢慢学出来。')}</div>
            <div class="mini-input-group">
              <label>${pt('onboardingRegisterNickname', '昵称')}</label>
              <div class="mini-input" style="text-align: left;">Ziming</div>
            </div>
            <div class="mini-input-group">
              <label>${pt('onboardingRegisterEmail', '邮箱')}</label>
              <div class="mini-input" style="text-align: left;">researcher@example.com</div>
            </div>
            <div class="mini-input-group">
              <label>${pt('onboardingRegisterPassword', '密码')}</label>
              <div class="mini-input" style="text-align: left;">••••••••</div>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: var(--space-md); font-size: 10px; color: var(--ink-muted);">
              <div style="width: 14px; height: 14px; border: 1px solid var(--line); border-radius: 4px; flex-shrink: 0; margin-top: 1px; background: var(--brand); display: flex; align-items: center; justify-content: center;">
                <i class="ph ph-check" style="font-size: 10px; color: white;"></i>
              </div>
              <span>${pt('onboardingRegisterTerms', '我同意服务条款。评论和系统行为均视为研究数据，用于改进推荐算法。')}</span>
            </div>
            <div class="mini-auth-btn">${pt('onboardingRegisterBtn', '创建账号')}</div>
            <div style="text-align: center; margin-top: var(--space-sm); font-size: 10px; color: var(--ink-muted);">
              ${pt('onboardingRegisterHasAccount', '已有账号？')}<span style="color: var(--brand);">${pt('onboardingRegisterLogin', '登录')}</span>
            </div>
          </div>
        `
      },
      'onboarding-survey': {
        title: 'Quick Survey',
        subtitle: pt('onboardingSurveySubtitle', '快速校准 · Onboarding 06'),
        device: 'mobile',
        hasNotch: true,
        hasNavBar: false,
        content: `
          <div class="mini-auth-container" style="text-align: left;">
            <div class="mini-step-indicator">2 / 3</div>
            <div class="mini-onboarding-title">${pt('onboardingSurveyTitle', '快速校准推荐系统')}</div>
            <div class="mini-onboarding-desc">${pt('onboardingSurveyDesc', '快速标记你的兴趣偏好：给更多、先收藏、还是不感兴趣。')}</div>
            <div style="background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-lg); padding: var(--space-md); margin-bottom: var(--space-md);">
              <div class="mini-paper-source" style="margin-bottom: 6px;"><span class="mini-paper-source-dot"></span>ArXiv AI</div>
              <div class="mini-paper-title" style="font-size: 13px; margin-bottom: 6px;">Training language agents to browse papers with persistent memory</div>
              <div class="mini-paper-desc">${pt('onboardingSurveyPaperDesc', '像研究员一样持续阅读文献，不是每次都从头来。')}</div>
              <div style="margin-top: var(--space-sm); font-size: 10px; color: var(--ink-muted);">
                ${pt('onboardingSurveyMatch', '加入你：与 Physics 兴趣匹配')}
              </div>
            </div>
            <div style="display: flex; gap: var(--space-sm); margin-bottom: var(--space-md);">
              <div style="flex: 1; text-align: center; padding: var(--space-sm); border: 1px solid var(--line); border-radius: var(--radius-md); font-size: 10px; color: var(--ink-muted);">
                ${pt('onboardingSurveyNotInterested', '不感兴趣')}
              </div>
              <div style="flex: 1; text-align: center; padding: var(--space-sm); border: 1px solid var(--brand); border-radius: var(--radius-md); font-size: 10px; color: var(--brand); background: var(--brand-soft);">
                ${pt('onboardingSurveySave', '收藏')}
              </div>
              <div style="flex: 1; text-align: center; padding: var(--space-sm); border: 1px solid var(--brand); border-radius: var(--radius-md); font-size: 10px; color: white; background: var(--brand);">
                ${pt('onboardingSurveyMore', '更多类似')}
              </div>
            </div>
            <div class="mini-auth-btn">${pt('onboardingSurveyEnterBtn', '进入今日简报')}</div>
            <div style="text-align: center; margin-top: var(--space-sm); font-size: 10px; color: var(--ink-muted);">
              ${pt('onboardingSurveyDeny', '不允许只选，只在 App 内显示')}
            </div>
          </div>
        `
      },
      'desktop-macos': {
        title: 'macOS App',
        subtitle: pt('desktopMacosSubtitle', '桌面应用 · macOS'),
        device: 'desktop',
        noOuterTitlebar: true,
        content: `
          <div style="width: 100%; height: 100%; background: var(--surface); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column;">
            <div style="height: 52px; background: var(--surface-muted); display: flex; align-items: center; padding: 0 20px; gap: 10px; border-bottom: 1px solid var(--line);">
              <div style="display: flex; gap: 8px;">
                <div style="width: 12px; height: 12px; border-radius: 50%; background: #ff5f57;"></div>
                <div style="width: 12px; height: 12px; border-radius: 50%; background: #febc2e;"></div>
                <div style="width: 12px; height: 12px; border-radius: 50%; background: #28c840;"></div>
              </div>
              <div style="flex: 1; text-align: center; font-size: 13px; font-weight: 600; color: var(--ink);">PaperDaily</div>
              <div style="width: 60px;"></div>
            </div>
            <div style="flex: 1; display: flex;">
              <div style="width: 220px; background: var(--surface); border-right: 1px solid var(--line); padding: 16px 12px; font-size: 12px;">
                <div style="font-size: 11px; font-weight: 600; color: var(--ink-muted); margin-bottom: 8px; padding: 0 8px; text-transform: uppercase; letter-spacing: 0.5px;">${pt('desktopMacosChannels', '研究频道')}</div>
                <div style="padding: 8px 10px; background: var(--brand-soft); color: var(--brand); border-radius: 8px; margin-bottom: 2px; font-weight: 500; display: flex; align-items: center; gap: 8px;">
                  <i class="ph ph-sparkle"></i> ${pt('desktopMacosNavToday', '今日简报')}
                </div>
                <div style="padding: 8px 10px; color: var(--ink-soft); border-radius: 8px; margin-bottom: 2px; display: flex; align-items: center; gap: 8px;">
                  <i class="ph ph-brain"></i> AI / LLM
                </div>
                <div style="padding: 8px 10px; color: var(--ink-soft); border-radius: 8px; margin-bottom: 2px; display: flex; align-items: center; gap: 8px;">
                  <i class="ph ph-atom"></i> Physics
                </div>
                <div style="padding: 8px 10px; color: var(--ink-soft); border-radius: 8px; margin-bottom: 2px; display: flex; align-items: center; gap: 8px;">
                  <i class="ph ph-dna"></i> Bio Medicine
                </div>
                <div style="padding: 8px 10px; color: var(--ink-soft); border-radius: 8px; margin-bottom: 2px; display: flex; align-items: center; gap: 8px;">
                  <i class="ph ph-bookmark-simple"></i> ${pt('desktopMacosNavReadLater', '稍后读')}
                </div>
                <div style="padding: 8px 10px; color: var(--ink-soft); border-radius: 8px; display: flex; align-items: center; gap: 8px;">
                  <i class="ph ph-binoculars"></i> ${pt('desktopMacosNavCollections', '收藏专题')}
                </div>
              </div>
              <div style="flex: 1; padding: 20px 24px; overflow-y: auto; border-right: 1px solid var(--line);">
                <div style="margin-bottom: 16px;">
                  <div style="font-size: 22px; font-weight: 700; color: var(--ink); margin-bottom: 4px;">Daily Papers</div>
                  <div style="font-size: 12px; color: var(--ink-muted);">${pt('desktopMacosSubtitleText', '为你精选 · 偏好 AI reasoning, AI safety, multimodal learning')}</div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  <div class="mini-paper-card" style="padding: 14px 16px; border: 1px solid var(--line-soft); border-radius: 12px; background: var(--paper);">
                    <div class="mini-rank" style="background: var(--ink); color: var(--paper); width: 28px; height: 28px; font-size: 11px;">★</div>
                    <div class="mini-paper-body">
                      <div class="mini-paper-source" style="font-size: 11px;"><span class="mini-paper-source-dot"></span>ArXiv AI</div>
                      <div class="mini-paper-title" style="font-size: 14px;">A new scaling law for reasoning in large language models</div>
                      <div class="mini-paper-desc" style="font-size: 12px;">${pt('desktopMacosDesc1', '模型推理能力提升规律变得可预测，改变训练预算规划方式。')}</div>
                    </div>
                    <div class="mini-bookmark"><i class="ph-fill ph-star" style="color: var(--amber-500);"></i></div>
                  </div>
                  <div class="mini-paper-card" style="padding: 14px 16px; border: 1px solid transparent; border-radius: 12px; background: transparent;">
                    <div class="mini-rank" style="color: var(--ink-muted);">02</div>
                    <div class="mini-paper-body">
                      <div class="mini-paper-source" style="font-size: 11px;"><span class="mini-paper-source-dot"></span>Nature</div>
                      <div class="mini-paper-title" style="font-size: 14px;">A reversible gene switch for safer cell therapies</div>
                      <div class="mini-paper-desc" style="font-size: 12px;">${pt('desktopMacosDesc2', '基因治疗新开关，降低临床风险。')}</div>
                    </div>
                    <div class="mini-bookmark"><i class="ph ph-bookmark-simple"></i></div>
                  </div>
                  <div class="mini-paper-card" style="padding: 14px 16px; border: 1px solid transparent; border-radius: 12px; background: transparent;">
                    <div class="mini-rank" style="color: var(--ink-muted);">03</div>
                    <div class="mini-paper-body">
                      <div class="mini-paper-source" style="font-size: 11px;"><span class="mini-paper-source-dot"></span>Science</div>
                      <div class="mini-paper-title" style="font-size: 14px;">Global methane emissions higher than thought</div>
                      <div class="mini-paper-desc" style="font-size: 12px;">${pt('desktopMacosDesc3', '卫星观测揭示甲烷排放增长超预期。')}</div>
                    </div>
                    <div class="mini-bookmark"><i class="ph ph-bookmark-simple"></i></div>
                  </div>
                </div>
              </div>
              <div style="width: 260px; padding: 20px; font-size: 12px; overflow-y: auto;">
                <div style="font-size: 11px; font-weight: 600; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">Why this matters</div>
                <div class="mini-key-finding" style="margin-bottom: 16px; padding: 12px; border-radius: 10px; background: var(--surface); border: 1px solid var(--line-soft);">
                  <div class="mini-key-finding-label" style="font-size: 11px; margin-bottom: 6px;"><i class="ph-fill ph-key"></i> Key Finding</div>
                  <p style="font-size: 12px; line-height: 1.6; color: var(--ink-soft); margin: 0;">${pt('desktopMacosKeyFinding', '推理能力随算力和数据质量可预测提升。')}</p>
                </div>
                <div style="font-size: 11px; font-weight: 600; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">In Plain English</div>
                <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: var(--ink-soft); line-height: 1.8;">
                  <li>${pt('desktopMacosPlain1', '更大的模型推理更好')}</li>
                  <li>${pt('desktopMacosPlain2', '关系是可预测的')}</li>
                  <li>${pt('desktopMacosPlain3', '数据质量很重要')}</li>
                </ul>
                <div style="margin-top: 20px;">
                  <button style="width: 100%; background: var(--ink); color: var(--paper); border: none; padding: 10px 14px; border-radius: 10px; font-size: 12px; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer;">
                    <i class="ph-fill ph-sparkle"></i> ${pt('desktopMacosListen', '听论文摘要')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        `
      }
      };
    }

    function openPreview(pageId) {
      const templates = getPageTemplates();
      const template = templates[pageId];
      if (!template) return;

      titleEl.textContent = template.title;
      subtitleEl.textContent = template.subtitle;

      let contentHtml = '';
      const isDesktop = template.device === 'desktop';

      if (isDesktop) {
        panel.classList.add('is-desktop-window');
        if (template.noOuterTitlebar) {
          contentHtml = `
          <div class="desktop-window is-native">
            <div class="desktop-window-content">
              ${template.content}
            </div>
          </div>
        `;
        } else {
          contentHtml = `
          <div class="desktop-window">
            <div class="desktop-window-titlebar">
              <div class="desktop-window-traffic">
                <span class="traffic-light close"></span>
                <span class="traffic-light minimize"></span>
                <span class="traffic-light maximize"></span>
              </div>
              <div class="desktop-window-title">${template.title}</div>
              <div style="width: 52px;"></div>
            </div>
            <div class="desktop-window-content">
              ${template.content}
            </div>
          </div>
        `;
        }
      } else {
        panel.classList.remove('is-desktop-window');
        contentHtml = `<div class="page-preview-device">`;
        if (template.hasNotch) {
          contentHtml += `<div class="device-notch"></div>`;
          contentHtml += `<div class="device-status-bar"><span>9:41</span><span class="device-status-bar-right"><i class="ph ph-cellular-signal"></i><i class="ph ph-wifi-high"></i><i class="ph ph-battery-full"></i></span></div>`;
        }
        contentHtml += `<div class="device-content${template.hasNotch ? ' has-notch' : ''}">${template.content}</div>`;
        if (template.hasNavBar) {
          const navHome = typeof i18next !== 'undefined' ? i18next.t('docs.previewNavHome', { fallbackValue: '首页' }) : '首页';
          const navStats = typeof i18next !== 'undefined' ? i18next.t('docs.previewNavStats', { fallbackValue: '数据' }) : '数据';
          const navSaved = typeof i18next !== 'undefined' ? i18next.t('docs.previewNavSaved', { fallbackValue: '收藏' }) : '收藏';
          const navSettings = typeof i18next !== 'undefined' ? i18next.t('docs.settings', { fallbackValue: '设置' }) : '设置';
          contentHtml += `
            <div class="device-nav-bar">
              <div class="device-nav-item ${template.activeNav === 'home' ? 'is-active' : ''}">
                <i class="ph ph-house"></i>
                <span>${navHome}</span>
              </div>
              <div class="device-nav-item ${template.activeNav === 'stats' ? 'is-active' : ''}">
                <i class="ph ph-chart-bar"></i>
                <span>${navStats}</span>
              </div>
              <div class="device-nav-item ${template.activeNav === 'saved' ? 'is-active' : ''}">
                <i class="ph ph-bookmark-simple"></i>
                <span>${navSaved}</span>
              </div>
              <div class="device-nav-item">
                <i class="ph ph-user-circle"></i>
                <span>${navSettings}</span>
              </div>
            </div>
          `;
        }
        contentHtml += '</div>';
      }

      bodyEl.innerHTML = contentHtml;

      overlay.classList.add('is-open');
      panel.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closePreview() {
      overlay.classList.remove('is-open');
      panel.classList.remove('is-open');
      panel.classList.remove('is-desktop-window');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-page-preview]').forEach(card => {
      card.addEventListener('click', () => {
        const pageId = card.getAttribute('data-page-preview');
        openPreview(pageId);
      });
    });

    closeBtn.addEventListener('click', closePreview);
    if (typeof i18next !== 'undefined') {
      i18next.on('languageChanged', () => {
        if (overlay.classList.contains('is-open')) {
          const currentPageId = document.querySelector('[data-page-preview].is-active')?.getAttribute('data-page-preview');
          if (currentPageId) openPreview(currentPageId);
        }
      });
    }
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closePreview();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        closePreview();
      }
    });
  }

  function initShowcaseTabs() {
    const tabButtons = document.querySelectorAll('[data-showcase-tab]');
    const panes = document.querySelectorAll('[data-showcase-pane]');
    if (!tabButtons.length) return;

    let currentIndex = 0;
    const tabIds = Array.from(tabButtons).map(btn => btn.dataset.showcaseTab);

    function switchTo(tabId) {
      tabButtons.forEach(btn => {
        btn.classList.toggle('is-active', btn.dataset.showcaseTab === tabId);
      });
      panes.forEach(pane => {
        pane.classList.toggle('is-active', pane.dataset.showcasePane === tabId);
      });
      currentIndex = tabIds.indexOf(tabId);
    }

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        switchTo(btn.dataset.showcaseTab);
        resetAutoPlay();
      });
    });

    let autoPlayTimer;
    function startAutoPlay() {
      autoPlayTimer = setInterval(() => {
        currentIndex = (currentIndex + 1) % tabIds.length;
        switchTo(tabIds[currentIndex]);
      }, 3500);
    }

    function resetAutoPlay() {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
      startAutoPlay();
    }

    const showcase = document.querySelector('.component-showcase');
    if (showcase) {
      showcase.addEventListener('mouseenter', () => {
        if (autoPlayTimer) clearInterval(autoPlayTimer);
      });
      showcase.addEventListener('mouseleave', () => {
        startAutoPlay();
      });
    }

    startAutoPlay();
  }

  function initSearchButton() {
    const searchBtn = document.getElementById('searchButton');
    if (!searchBtn) return;
    searchBtn.addEventListener('click', () => {
      window.location.href = 'docs.html#icon-system';
    });
  }

  function initIconBrowser() {
    const input = document.getElementById('iconSearchInput');
    const grid = document.getElementById('iconGrid');
    const count = document.getElementById('iconCount');
    const empty = document.getElementById('iconEmpty');
    if (!input || !grid || !count || !empty) return;

    const icons = [
      ['magnifying-glass', '搜索 search find'],
      ['house', '首页 home'],
      ['newspaper', '日报 news paper'],
      ['file-text', '论文 document paper'],
      ['bookmark-simple', '收藏 save bookmark'],
      ['star', '星标 favorite'],
      ['sparkle', 'AI summary magic'],
      ['brain', '智能 brain'],
      ['chat-circle', '对话 chat copilot'],
      ['quotes', '引用 citation quote'],
      ['warning', '警告 warning alert'],
      ['info', '信息 info'],
      ['lightbulb', '提示 tip idea'],
      ['text-b', '加粗 bold'],
      ['text-italic', '斜体 italic'],
      ['list-bullets', '列表 bullets'],
      ['code', '代码 code'],
      ['gear-six', '设置 settings'],
      ['sliders', '筛选 filter settings'],
      ['funnel', '过滤 filter'],
      ['globe', '语言 i18n international'],
      ['translate', '翻译 translate language'],
      ['text-aa', '字号 accessibility'],
      ['moon', '暗色 dark theme'],
      ['sun', '亮色 light theme'],
      ['caret-left', '返回 back'],
      ['arrow-right', '前进 next'],
      ['caret-double-down', '下滑 scroll'],
      ['dots-three', '更多 more'],
      ['dots-three-circle', '更多 more menu'],
      ['share-network', '分享 share'],
      ['download-simple', '下载 download'],
      ['upload-simple', '上传 upload'],
      ['copy', '复制 copy'],
      ['check', '完成 check'],
      ['x', '关闭 close'],
      ['plus', '新增 add'],
      ['minus', '减少 remove'],
      ['calendar', '日期 calendar'],
      ['clock', '时间 time'],
      ['chart-bar', '数据 chart'],
      ['hash', '标签 tag hash'],
      ['tag', '标签 tag'],
      ['users', '作者 users'],
      ['user-circle', '账户 profile'],
      ['bell', '通知 notification'],
      ['eye', '阅读 read view'],
      ['eye-slash', '隐藏 hide'],
      ['arrows-clockwise', '刷新 refresh'],
      ['arrows-left-right', '双向 rtl direction'],
      ['device-mobile', '移动端 mobile'],
      ['desktop', '桌面端 desktop'],
      ['github-logo', 'GitHub'],
      ['atom', '物理 science'],
      ['dna', '生物 bio'],
      ['binoculars', '发现 discover']
    ];

    async function copyText(text) {
      try {
        await navigator.clipboard.writeText(text);
      } catch (error) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
    }

    function render() {
      const query = input.value.trim().toLowerCase();
      const filtered = icons.filter(([name, keywords]) => {
        const haystack = `${name} ${keywords}`.toLowerCase();
        return query === '' || haystack.includes(query);
      });

      grid.innerHTML = '';
      filtered.forEach(([name]) => {
        const card = document.createElement('button');
        card.className = 'icon-card';
        card.type = 'button';
        card.setAttribute('aria-label', `复制 ${name}`);
        card.innerHTML = `
          <i class="ph ph-${name}"></i>
          <span class="icon-name">${name}</span>
          <span class="copy-toast">Copied</span>
        `;
        card.addEventListener('click', async () => {
          await copyText(`ph ph-${name}`);
          card.classList.add('copied');
          window.setTimeout(() => card.classList.remove('copied'), 900);
        });
        grid.appendChild(card);
      });

      empty.hidden = filtered.length > 0;
      count.textContent = query ? `${filtered.length} / ${icons.length}` : `常用 ${filtered.length}`;
    }

    input.addEventListener('input', render);
    render();
  }

  function initGlobeLottie() {
    const canvas = document.getElementById('globeLottie');
    if (!canvas || typeof CanvasKitInit === 'undefined') return;

    const basePath = 'assets/global-knowledge-lottie/';
    const jsonPath = basePath + 'animations/global-knowledge-earth.lottie.json';
    const fontPath = basePath + 'fonts/ArialUnicode.ttf';

    async function fetchOk(url, type) {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`${type} load failed: ${url}, HTTP ${res.status}`);
      return res;
    }

    (async () => {
      try {
        const CanvasKit = await CanvasKitInit({
          locateFile: (file) => basePath + file
        });

        const [jsonText, fontBuffer] = await Promise.all([
          fetchOk(jsonPath, 'json').then(r => r.text()),
          fetchOk(fontPath, 'font').then(r => r.arrayBuffer())
        ]);

        const doc = JSON.parse(jsonText);
        const w = Number(doc.w || 320);
        const h = Number(doc.h || 320);
        const fps = Number(doc.fr || 30);
        const ip = Number(doc.ip || 0);
        const op = Number(doc.op || 1);
        const totalFrames = Math.max(1, op - ip);

        const rect = canvas.getBoundingClientRect();
        const displayWidth = Math.max(w, Math.round(rect.width || w));
        const displayHeight = Math.max(h, Math.round(rect.height || h));
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const renderWidth = Math.round(displayWidth * pixelRatio);
        const renderHeight = Math.round(displayHeight * pixelRatio);

        canvas.width = renderWidth;
        canvas.height = renderHeight;
        canvas.style.width = displayWidth + 'px';
        canvas.style.height = displayHeight + 'px';

        const assets = {
          'ArialUnicode.ttf': fontBuffer
        };

        const animation = CanvasKit.MakeManagedAnimation(jsonText, assets);
        if (!animation) throw new Error('CanvasKit.MakeManagedAnimation returned null');

        const surface = CanvasKit.MakeCanvasSurface(canvas);
        if (!surface) throw new Error('CanvasKit.MakeCanvasSurface returned null');

        const skCanvas = surface.getCanvas();
        const bounds = CanvasKit.LTRBRect(0, 0, renderWidth, renderHeight);
        const start = performance.now();

        function draw(now) {
          const elapsedSeconds = (now - start) / 1000;
          const frame = ip + ((elapsedSeconds * fps) % totalFrames);

          animation.seekFrame(frame);
          skCanvas.clear(CanvasKit.TRANSPARENT);
          animation.render(skCanvas, bounds);
          surface.flush();

          requestAnimationFrame(draw);
        }

        requestAnimationFrame(draw);

        canvas.dataset.animationReady = 'true';
        canvas.dataset.renderWidth = String(renderWidth);
        canvas.dataset.renderHeight = String(renderHeight);
        console.log('[CanvasKit] playing: ' + renderWidth + 'x' + renderHeight + ' backing, ' + fps + 'fps, ' + totalFrames + ' frames');

        window.addEventListener('beforeunload', () => {
          try { animation.delete(); } catch (_) {}
          try { surface.delete(); } catch (_) {}
        });
      } catch (err) {
        console.error('[CanvasKit] Error:', err);
      }
    })();
  }

  function init() {
    initTheme();
    initFontSize();
    initSmoothScroll();
    initScrollSpy();
    initBookmarkButtons();
    initPageTabs();
    initPaperCardStates();
    initSummaryModes();
    initCommandBar();
    initBottomSheet();
    initCitationToggle();
    initSidebarToggle();
    initSettingsToggle();
    initSidebarFilter();
    initDocNavActiveState();
    initPagePreview();
    initI18n();
    initShowcaseTabs();
    initSearchButton();
    initIconBrowser();
    initGlobeLottie();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
