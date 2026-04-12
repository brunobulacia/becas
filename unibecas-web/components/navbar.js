function loadNavbar(containerId) {
    const currentPage = window.location.pathname;
    const isInPages = currentPage.includes('/pages/');
    const prefix = isInPages ? '../' : '';
    const pagesPrefix = isInPages ? '' : 'pages/';

    const links = [
        { name: 'Dashboard', href: `${prefix}index.html`, icon: '📊' },
        { name: 'Estudiantes', href: `${pagesPrefix}estudiantes.html`, icon: '🎓' },
        { name: 'Carreras', href: `${pagesPrefix}carreras.html`, icon: '📚' },
        { name: 'Becas', href: `${pagesPrefix}becas.html`, icon: '💰' },
        { name: 'Convocatorias', href: `${pagesPrefix}convocatorias.html`, icon: '📋' },
        { name: 'Solicitudes', href: `${pagesPrefix}solicitudes.html`, icon: '📝' },
        { name: 'Asignaciones', href: `${pagesPrefix}asignaciones.html`, icon: '✅' },
    ];

    const navHTML = `
    <nav class="bg-gray-900 shadow-lg">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center space-x-2">
                    <span class="text-2xl">🎓</span>
                    <span class="text-white font-bold text-xl">UniBecas</span>
                </div>
                <div class="hidden md:flex items-center space-x-1">
                    ${links.map(link => {
                        const isActive = currentPage.endsWith(link.href.replace('../', '/').replace('./', '/')) ||
                            (link.name === 'Dashboard' && (currentPage.endsWith('/') || currentPage.endsWith('/index.html') || currentPage.endsWith('/unibecas-web/')));
                        return `<a href="${link.href}" class="px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}">${link.name}</a>`;
                    }).join('')}
                </div>
                <button id="mobile-menu-btn" class="md:hidden text-gray-300 hover:text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
            </div>
        </div>
        <div id="mobile-menu" class="hidden md:hidden pb-3 px-4">
            ${links.map(link => {
                const isActive = currentPage.endsWith(link.href.replace('../', '/').replace('./', '/'));
                return `<a href="${link.href}" class="block px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}">${link.icon} ${link.name}</a>`;
            }).join('')}
        </div>
    </nav>`;

    document.getElementById(containerId).innerHTML = navHTML;

    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (btn && menu) {
        btn.addEventListener('click', () => menu.classList.toggle('hidden'));
    }
}
