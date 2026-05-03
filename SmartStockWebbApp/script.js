(function () {
    'use strict';

    const root = document.getElementById('root');

    if (!window.React || !window.ReactDOM) {
        root.innerHTML = '<main class="runtime-error"><h1>SmartStock needs React to load.</h1><p>Please check your internet connection and refresh the page.</p></main>';
        return;
    }

    const React = window.React;
    const ReactDOM = window.ReactDOM;
    const { useEffect, useMemo, useState } = React;
    const h = React.createElement;

    const STORAGE = {
        activeView: 'smartstock-active-view',
        branches: 'smartstock-branches',
        inventory: 'smartstock-inventory',
        notifications: 'smartstock-notifications',
        flashSaleConfig: 'smartstock-flash-sale-config',
        stockTrend: 'smartstock-stock-trend',
        session: 'session',
        signedOut: 'smartstock-signed-out',
        tickets: 'smartstock-tickets',
        theme: 'smartstock-theme',
        users: 'users',
    };

    const DEFAULT_USER = {
        name: 'Juan Dela Cruz',
        email: 'admin@rfchein.com',
        pass: 'admin123',
        role: 'Admin',
        store: 'RF Chein Gadgets',
        avatar: 'assets/logo/rf_chein_logo.jpg',
        theme: 'dark',
    };

    const DEFAULT_INVENTORY = [
        { id: '1', model: 'iPhone 14 Pro', brand: 'Apple', specs: '256GB, Space Black', quantity: 8, platform: 'ios', category: 'Flagship', condition: 'New', image: 'assets/phones/iphone-14-pro.jpg' },
        { id: '2', model: 'Samsung Galaxy S24', brand: 'Samsung', specs: '256GB, Phantom Black', quantity: 6, platform: 'android', category: 'Flagship', condition: 'New', image: 'assets/phones/samsung-galaxy-s24.jpg' },
        { id: '3', model: 'Redmi Note 13', brand: 'Xiaomi', specs: '256GB, Midnight Black', quantity: 5, platform: 'android', category: 'Mid Range', condition: 'New', image: 'assets/phones/redmi-note-13.jpg' },
        { id: '4', model: 'Vivo V30', brand: 'Vivo', specs: '128GB, Elegant Black', quantity: 4, platform: 'android', category: 'Mid Range', condition: 'New', image: 'assets/phones/vivo-v30.jpg' },
        { id: '5', model: 'OnePlus 12', brand: 'OnePlus', specs: '256GB, Silky Black', quantity: 3, platform: 'android', category: 'Flagship', condition: 'New', image: 'assets/phones/oneplus-12.jpg' },
        { id: '6', model: 'OPPO Reno 11', brand: 'OPPO', specs: '256GB, Rock Grey', quantity: 5, platform: 'android', category: 'Mid Range', condition: 'New', image: 'assets/phones/oppo-reno-11.jpg' },
        { id: '7', model: 'iPhone 13', brand: 'Apple', specs: '128GB, Midnight', quantity: 2, platform: 'ios', category: 'Flagship', condition: 'Pre-owned', image: 'assets/phones/iphone-13.jpg' },
        { id: '8', model: 'Galaxy A55', brand: 'Samsung', specs: '128GB, Awesome Navy', quantity: 4, platform: 'android', category: 'Mid Range', condition: 'New', image: 'assets/phones/galaxy-a55.jpg' },
    ];

    const PRODUCT_CATALOG = [
        { brand: 'Apple', category: 'Flagship', condition: 'New', image: 'assets/phones/iphone-14-pro.jpg', model: 'iPhone 14 Pro', platform: 'ios', specs: '256GB, Space Black' },
        { brand: 'Samsung', category: 'Flagship', condition: 'New', image: 'assets/phones/samsung-galaxy-s24.jpg', model: 'Samsung Galaxy S24', platform: 'android', specs: '256GB, Phantom Black' },
        { brand: 'Xiaomi', category: 'Mid Range', condition: 'New', image: 'assets/phones/redmi-note-13.jpg', model: 'Redmi Note 13', platform: 'android', specs: '256GB, Midnight Black' },
        { brand: 'Vivo', category: 'Mid Range', condition: 'New', image: 'assets/phones/vivo-v30.jpg', model: 'Vivo V30', platform: 'android', specs: '128GB, Elegant Black' },
        { brand: 'OnePlus', category: 'Flagship', condition: 'New', image: 'assets/phones/oneplus-12.jpg', model: 'OnePlus 12', platform: 'android', specs: '256GB, Silky Black' },
        { brand: 'OPPO', category: 'Mid Range', condition: 'New', image: 'assets/phones/oppo-reno-11.jpg', model: 'OPPO Reno 11', platform: 'android', specs: '256GB, Rock Grey' },
        { brand: 'Apple', category: 'Flagship', condition: 'Pre-owned', image: 'assets/phones/iphone-13.jpg', model: 'iPhone 13', platform: 'ios', specs: '128GB, Midnight' },
        { brand: 'Samsung', category: 'Mid Range', condition: 'New', image: 'assets/phones/galaxy-a55.jpg', model: 'Galaxy A55', platform: 'android', specs: '128GB, Awesome Navy' },
    ];

    const PRODUCT_MODEL_OPTIONS = PRODUCT_CATALOG.map((item) => ({ label: item.model, value: item.model }));
    const PRODUCT_BRAND_OPTIONS = [...new Set(PRODUCT_CATALOG.map((item) => item.brand))]
        .map((brand) => ({ label: brand, value: brand }));
    const PRODUCT_SPEC_OPTIONS = [...new Set(PRODUCT_CATALOG.map((item) => item.specs))]
        .map((specs) => ({ label: specs, value: specs }));

    const DEFAULT_FLASH_SALE_CONFIG = {
        brand: 'Apple',
        stockLimit: 21,
        timerHours: 6,
    };

    const DEFAULT_TICKETS = [
        {
            id: 'ticket-1',
            type: 'Inquiry',
            customer: 'John Francis Busel',
            email: 'john.francis@example.com',
            phone: '0917 000 1122',
            product: 'iPhone 14 Pro',
            message: 'Is the 256GB Space Black unit still available today?',
            reply: 'Yes, it is available. We can reserve it until closing time.',
            status: 'Open',
            priority: 'High',
            createdAt: 'Today, 9:20 AM',
        },
        {
            id: 'ticket-2',
            type: 'Reservation',
            customer: 'Almera Ex',
            email: 'almera.ex@example.com',
            phone: '0998 455 2211',
            product: 'Samsung Galaxy S24',
            message: 'Please reserve one Phantom Black unit for pickup tomorrow.',
            reply: '',
            status: 'Pending',
            priority: 'Medium',
            createdAt: 'Today, 10:05 AM',
        },
    ];

    const DEFAULT_BRANCHES = [
        { id: 'main', name: 'Main Branch', location: 'RF Chein HQ', manager: 'Juan Dela Cruz', status: 'Online', lastSync: '2 min ago', inventory: 37, tickets: 2, channel: 'Headquarters' },
        { id: 'north', name: 'North Kiosk', location: 'City Mall Level 2', manager: 'Rhea Cruz', status: 'Online', lastSync: '8 min ago', inventory: 18, tickets: 1, channel: 'Subsidiary' },
        { id: 'south', name: 'South Service Desk', location: 'Market Plaza', manager: 'Kim Dela Torre', status: 'Syncing', lastSync: 'In progress', inventory: 22, tickets: 3, channel: 'Subsidiary' },
        { id: 'east', name: 'East Pickup Hub', location: 'Transit Center', manager: 'Maria Santos', status: 'Offline', lastSync: '1 hr ago', inventory: 14, tickets: 0, channel: 'Subsidiary' },
    ];

    const NAV_ITEMS = [
        { id: 'home', label: 'Home', icon: 'fa-solid fa-table-cells-large' },
        { id: 'portal', label: 'Portal', icon: 'fa-solid fa-store' },
        { id: 'inventory', label: 'Inventory', icon: 'fa-solid fa-cube' },
        { id: 'tickets', label: 'Tickets', icon: 'fa-solid fa-comments' },
        { id: 'branches', label: 'Branches', icon: 'fa-solid fa-network-wired' },
        { id: 'units', label: 'Units', icon: 'fa-solid fa-arrow-right-arrow-left' },
        { id: 'customers', label: 'Customers', icon: 'fa-solid fa-users' },
        { id: 'analytics', label: 'Analytics', icon: 'fa-solid fa-chart-column' },
        { id: 'profile', label: 'Profile', icon: 'fa-solid fa-circle-user' },
    ];

    const CHARTS = {
        stock: [
            { label: 'Mon', value: 32 },
            { label: 'Tue', value: 35 },
            { label: 'Wed', value: 34 },
            { label: 'Thu', value: 39 },
            { label: 'Fri', value: 36 },
            { label: 'Sat', value: 41 },
            { label: 'Sun', value: 37 },
        ],
        units: [
            { label: 'Jan', value: 18 },
            { label: 'Feb', value: 24 },
            { label: 'Mar', value: 21 },
            { label: 'Apr', value: 29 },
            { label: 'May', value: 32 },
            { label: 'Jun', value: 38 },
        ],
        customers: [
            { label: 'W1', value: 8 },
            { label: 'W2', value: 11 },
            { label: 'W3', value: 9 },
            { label: 'W4', value: 14 },
            { label: 'W5', value: 18 },
            { label: 'W6', value: 21 },
        ],
        accuracy: [
            { label: 'Jan', value: 92 },
            { label: 'Feb', value: 94 },
            { label: 'Mar', value: 96 },
            { label: 'Apr', value: 95 },
            { label: 'May', value: 98 },
            { label: 'Jun', value: 99 },
        ],
        category: [
            { label: 'Jan', value: 19 },
            { label: 'Feb', value: 24 },
            { label: 'Mar', value: 26 },
            { label: 'Apr', value: 31 },
            { label: 'May', value: 34 },
            { label: 'Jun', value: 37 },
        ],
    };

    function cx() {
        return Array.from(arguments).filter(Boolean).join(' ');
    }

    function readJson(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function readArray(key, fallback) {
        const value = readJson(key, fallback);
        return Array.isArray(value) ? value : fallback;
    }

    function writeJson(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    async function apiRequest(path, options) {
        if (location.protocol === 'file:') {
            return null;
        }

        try {
            const response = await fetch(path, {
                headers: { 'Content-Type': 'application/json' },
                ...(options || {}),
            });

            if (!response.ok) {
                return null;
            }

            const text = await response.text();
            return text ? JSON.parse(text) : null;
        } catch (error) {
            return null;
        }
    }

    function safeQuantity(value) {
        const quantity = Number.parseInt(value, 10);
        return Number.isFinite(quantity) && quantity >= 0 ? quantity : 0;
    }

    function getStatus(quantity) {
        if (quantity <= 0) {
            return { label: 'Out of Stock', className: 'out' };
        }

        if (quantity <= 3) {
            return { label: 'Low Stock', className: 'low' };
        }

        return { label: 'In Stock', className: 'ready' };
    }

    function summarizeInventory(inventory) {
        const brands = new Set(inventory.map((item) => item.brand).filter(Boolean));
        const totalUnits = inventory.reduce((sum, item) => sum + safeQuantity(item.quantity), 0);
        const lowStock = inventory.filter((item) => {
            const quantity = safeQuantity(item.quantity);
            return quantity > 0 && quantity <= 3;
        }).length;
        const outOfStock = inventory.filter((item) => safeQuantity(item.quantity) === 0).length;

        return {
            brands: brands.size,
            lowStock,
            models: inventory.length,
            outOfStock,
            totalUnits,
        };
    }

    function describeSeries(data) {
        if (!Array.isArray(data) || !data.length) {
            return {
                average: 0,
                change: 0,
                first: 0,
                growthLabel: 'Stable',
                last: 0,
                peak: { label: '-', value: 0 },
            };
        }

        const first = Number(data[0].value) || 0;
        const last = Number(data[data.length - 1].value) || 0;
        const change = last - first;
        const sum = data.reduce((total, point) => total + (Number(point.value) || 0), 0);
        const peak = data.reduce((max, point) => ((Number(point.value) || 0) > max.value ? { label: point.label, value: Number(point.value) || 0 } : max), { label: data[0].label, value: Number(data[0].value) || 0 });
        const average = sum / data.length;

        return {
            average,
            change,
            first,
            growthLabel: change > 0 ? 'Uptrend' : change < 0 ? 'Decline' : 'Stable',
            last,
            peak,
        };
    }

    function summarizeDescriptiveAnalytics(inventory) {
        const safeInventory = Array.isArray(inventory) ? inventory : [];
        const totalUnits = safeInventory.reduce((sum, item) => sum + safeQuantity(item.quantity), 0);
        const productCount = safeInventory.length;
        const avgUnitsPerModel = productCount ? totalUnits / productCount : 0;
        const lowStock = safeInventory.filter((item) => safeQuantity(item.quantity) <= 3).length;
        const topProducts = [...safeInventory]
            .sort((a, b) => safeQuantity(b.quantity) - safeQuantity(a.quantity))
            .slice(0, 4)
            .map((item) => ({
                brand: item.brand || 'Unknown',
                model: item.model || 'Unnamed model',
                quantity: safeQuantity(item.quantity),
            }));

        const inventorySeries = describeSeries(CHARTS.category);
        const movementSeries = describeSeries(CHARTS.units);
        const accuracySeries = describeSeries(CHARTS.accuracy);
        const salesSeries = describeSeries(CHARTS.customers);

        return {
            accuracySeries,
            avgUnitsPerModel,
            inventorySeries,
            lowStock,
            movementSeries,
            salesSeries,
            topProducts,
            totalUnits,
        };
    }

    function summarizeBrandInventory(inventory) {
        const brandPalette = [
            { color: '#A2AAAD', key: 'apple', label: 'Apple' },
            { color: '#4A6A9C', key: 'samsung', label: 'Samsung' },
            { color: '#F4A061', key: 'xiaomi', label: 'Xiaomi' },
            { color: '#4D8B6F', key: 'oppo', label: 'Oppo' },
            { color: '#7D9BD1', key: 'vivo', label: 'Vivo' },
        ];

        const totals = brandPalette.reduce((acc, item) => ({ ...acc, [item.key]: 0 }), {});
        const normalize = (value) => String(value || '').toLowerCase().trim();

        (Array.isArray(inventory) ? inventory : []).forEach((item) => {
            const quantity = safeQuantity(item.quantity);
            const brand = normalize(item.brand);

            if (brand === 'apple') {
                totals.apple += quantity;
            } else if (brand === 'samsung') {
                totals.samsung += quantity;
            } else if (brand === 'xiaomi') {
                totals.xiaomi += quantity;
            } else if (brand === 'oppo') {
                totals.oppo += quantity;
            } else if (brand === 'vivo') {
                totals.vivo += quantity;
            }
        });

        const total = Object.values(totals).reduce((sum, value) => sum + value, 0);

        return brandPalette.map((item) => {
            const value = totals[item.key] || 0;
            const percent = total > 0 ? (value / total) * 100 : 0;

            return {
                ...item,
                percent,
                value,
            };
        });
    }

    function InventoryByBrandDonut({ inventory }) {
        const data = summarizeBrandInventory(inventory);
        const total = data.reduce((sum, item) => sum + item.value, 0);
        let cumulative = 0;
        const gradientStops = data.map((item) => {
            const start = cumulative;
            const slice = total > 0 ? (item.value / total) * 360 : 0;
            const end = cumulative + slice;
            cumulative = end;
            return `${item.color} ${start}deg ${end}deg`;
        });
        const donutGradient = total > 0 ? `conic-gradient(${gradientStops.join(', ')})` : 'conic-gradient(#1a1a1a 0deg 360deg)';

        return h(
            'section',
            { className: 'brand-donut-card' },
            [
                h('h3', { className: 'brand-donut-title', key: 'title' }, 'Inventory by Brand'),
                h('div', { className: 'brand-donut-layout', key: 'layout' }, [
                    h('div', { className: 'brand-donut-ring', key: 'ring', style: { background: donutGradient } }, [
                        h('span', { className: 'brand-donut-center', key: 'center' }, total),
                    ]),
                    h('ul', { className: 'brand-donut-legend', key: 'legend' }, data.map((item) => (
                        h('li', { key: item.label }, [
                            h('span', { className: 'brand-dot', key: 'dot', style: { background: item.color } }),
                            h('span', { className: 'brand-name', key: 'name' }, item.label),
                            h('span', { className: 'brand-percent', key: 'percent' }, `${Math.round(item.percent)}%`),
                            h('strong', { className: 'brand-value', key: 'value' }, String(item.value)),
                        ])
                    ))),
                ]),
            ]
        );
    }

    function filterSeriesByRange(data, range) {
        if (!Array.isArray(data) || !data.length) {
            return [];
        }

        const sizeMap = {
            '7d': 2,
            '30d': 4,
            '6m': data.length,
        };
        const size = Math.min(data.length, sizeMap[range] || data.length);
        return data.slice(-size);
    }

    function icon(name) {
        return h('i', { className: name, 'aria-hidden': 'true' });
    }

    function slugify(value) {
        return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    function smoothPath(points) {
        if (!points.length) {
            return '';
        }

        if (points.length === 1) {
            return `M ${points[0].x},${points[0].y}`;
        }

        let path = `M ${points[0].x},${points[0].y}`;

        for (let index = 0; index < points.length - 1; index += 1) {
            const p0 = points[index - 1] || points[index];
            const p1 = points[index];
            const p2 = points[index + 1];
            const p3 = points[index + 2] || p2;
            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
        }

        return path;
    }

    function formatChartValue(value, unit) {
        if (unit === '%') {
            return `${value}%`;
        }

        return `${value} ${unit}`;
    }

    function timestampLabel() {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            month: 'short',
            day: 'numeric',
        }).format(new Date());
    }

    function stockTrendLabel() {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
        }).format(new Date());
    }

    function Button({ children, className, iconClass, onClick, type, variant, ariaLabel }) {
        return h(
            'button',
            {
                'aria-label': ariaLabel,
                className: cx('btn', variant ? `btn-${variant}` : 'btn-primary', className),
                onClick,
                type: type || 'button',
            },
            [iconClass ? icon(iconClass) : null, h('span', { key: 'label' }, children)]
        );
    }

    function IconButton({ iconClass, label, onClick, tone }) {
        return h(
            'button',
            {
                'aria-label': label,
                className: cx('icon-btn', tone && `icon-btn-${tone}`),
                onClick,
                title: label,
                type: 'button',
            },
            icon(iconClass)
        );
    }

    function ToggleSwitch({ checked, label, onChange }) {
        return h(
            'label',
            { className: 'toggle-switch' },
            [
                h('span', { className: 'sr-only', key: 'label' }, label),
                h('input', {
                    checked,
                    key: 'input',
                    onChange: (event) => onChange(event.target.checked),
                    type: 'checkbox',
                }),
                h('span', { className: 'toggle-track', key: 'track' }),
            ]
        );
    }

    function StatCard({ iconClass, label, value, note, tone }) {
        return h(
            'article',
            { className: 'stat-card' },
            [
                h('span', { className: cx('stat-icon', tone), key: 'icon' }, icon(iconClass)),
                h('span', { className: 'stat-label', key: 'label' }, label),
                h('strong', { key: 'value' }, value),
                note ? h('small', { key: 'note' }, note) : null,
            ]
        );
    }

    function formatFlashTime(value) {
        return String(value).padStart(2, '0');
    }

    function FlashSalesPanel({ config, inventory, onNavigate }) {
        const [now, setNow] = useState(() => Date.now());
        const saleEndsAt = useMemo(() => Date.now() + (1000 * 60 * 60 * (config?.timerHours || 6)), [config?.timerHours]);

        useEffect(() => {
            const timer = window.setInterval(() => setNow(Date.now()), 1000);
            return () => window.clearInterval(timer);
        }, []);

        const remaining = Math.max(saleEndsAt - now, 0);
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        const featuredBrand = config?.brand || 'Apple';
        const stockLimit = Number.isFinite(Number(config?.stockLimit)) ? Number(config.stockLimit) : 21;
        const featuredPromos = [
            { badge: 'Hot Pick', tone: 'green' },
            { badge: 'Fast Move', tone: 'blue' },
            { badge: 'Limited Run', tone: 'amber' },
        ].map((promo, index) => {
            const fallback = inventory.length ? inventory[index % inventory.length] : null;
            const match = inventory.find((item) => item.brand === featuredBrand) || fallback;
            const quantity = match ? safeQuantity(match.quantity) : 0;

            return {
                ...promo,
                brand: match?.brand || 'Featured stock',
                model: match?.model || `${featuredBrand} Spotlight`,
                quantity: Math.min(quantity || stockLimit, stockLimit),
                specs: match?.specs || 'Ready to browse now',
            };
        });

        return h(
            'section',
            { className: 'flash-sale-panel' },
            [
                h('div', { className: 'flash-sale-copy', key: 'copy' }, [
                    h('span', { className: 'eyebrow', key: 'eyebrow' }, 'Flash Sales'),
                    h('h2', { key: 'title' }, `Move ${featuredBrand} stock faster with a live limited-time drop.`),
                    h('p', { key: 'subtitle' }, `A rotating showcase for ${featuredBrand} that creates urgency, highlights available units, and encourages customers to explore your best inventory now.`),
                    h('div', { className: 'flash-sale-countdown', key: 'countdown' }, [
                        h('div', { className: 'flash-sale-time', key: 'hours' }, [h('strong', { key: 'value' }, formatFlashTime(hours)), h('span', { key: 'label' }, 'Hours')]),
                        h('div', { className: 'flash-sale-time', key: 'minutes' }, [h('strong', { key: 'value' }, formatFlashTime(minutes)), h('span', { key: 'label' }, 'Minutes')]),
                        h('div', { className: 'flash-sale-time', key: 'seconds' }, [h('strong', { key: 'value' }, formatFlashTime(seconds)), h('span', { key: 'label' }, 'Seconds')]),
                    ]),
                    h('div', { className: 'flash-sale-actions', key: 'actions' }, [
                        h(Button, { iconClass: 'fa-solid fa-bolt', key: 'shop', onClick: () => onNavigate('portal') }, 'Browse Flash Sale'),
                        h(Button, { iconClass: 'fa-solid fa-cube', key: 'inventory', onClick: () => onNavigate('inventory'), variant: 'secondary' }, 'View Inventory'),
                    ]),
                ]),
                h('div', { className: 'flash-sale-showcase', key: 'showcase' }, [
                    h('article', { className: 'flash-sale-feature', key: 'feature' }, [
                        h('span', { className: 'flash-sale-badge', key: 'badge' }, 'Limited window'),
                        h('strong', { key: 'title' }, 'Featured Drop'),
                        h('h3', { key: 'model' }, featuredPromos[0]?.model || 'Featured stock'),
                        h('p', { key: 'desc' }, `${featuredPromos[0]?.brand || 'Featured stock'} · ${featuredPromos[0]?.specs || 'Ready now'}`),
                        h('div', { className: 'flash-sale-feature-foot', key: 'foot' }, [
                            h('div', { key: 'meta' }, [
                                h('span', { key: 'label' }, 'Units ready'),
                                h('strong', { key: 'value' }, String(featuredPromos[0]?.quantity ?? stockLimit)),
                            ]),
                            h('span', { className: 'flash-sale-live', key: 'live' }, 'Live now'),
                        ]),
                    ]),
                    h('div', { className: 'flash-sale-grid', key: 'grid' }, featuredPromos.map((item) => (
                        h('article', { className: cx('flash-sale-card', item.tone), key: `${item.model}-${item.badge}` }, [
                            h('span', { className: 'flash-sale-card-badge', key: 'badge' }, item.badge),
                            h('strong', { key: 'model' }, item.model),
                            h('small', { key: 'meta' }, `${item.brand} · ${item.quantity} units ready`),
                        ])
                    ))),
                ]),
            ]
        );
    }

    function FlashSaleConfigPanel({ config, inventory, onSave }) {
        const brandOptions = [...new Set(inventory.map((item) => item.brand).filter(Boolean))]
            .sort((left, right) => left.localeCompare(right))
            .map((brand) => ({ label: brand, value: brand }));
        const [form, setForm] = useState({
            brand: config.brand,
            stockLimit: String(config.stockLimit),
            timerHours: String(config.timerHours),
        });

        useEffect(() => {
            setForm({
                brand: config.brand,
                stockLimit: String(config.stockLimit),
                timerHours: String(config.timerHours),
            });
        }, [config.brand, config.stockLimit, config.timerHours]);

        function updateField(field, value) {
            setForm((current) => ({ ...current, [field]: value }));
        }

        function submit(event) {
            event.preventDefault();
            onSave({
                brand: form.brand || DEFAULT_FLASH_SALE_CONFIG.brand,
                stockLimit: Math.max(1, safeQuantity(form.stockLimit) || DEFAULT_FLASH_SALE_CONFIG.stockLimit),
                timerHours: Math.max(1, safeQuantity(form.timerHours) || DEFAULT_FLASH_SALE_CONFIG.timerHours),
            });
        }

        return h(
            'section',
            { className: 'control-card flash-sale-config-card' },
            [
                h('div', { className: 'analytics-card-head', key: 'head' }, [
                    h('div', { key: 'copy' }, [
                        h('strong', { key: 'title' }, 'Flash Sale Configuration'),
                        h('small', { key: 'subtitle' }, 'Control the live drop from the admin dashboard.'),
                    ]),
                    h('span', { className: 'flash-sale-live', key: 'live' }, 'Neon Lime'),
                ]),
                h('form', { className: 'flash-sale-config-form', key: 'form', onSubmit: submit }, [
                    h(SelectField, {
                        key: 'brand',
                        label: 'Brand Selection',
                        onChange: (value) => updateField('brand', value),
                        options: brandOptions,
                        placeholder: 'Choose a brand',
                        required: true,
                        value: form.brand,
                    }),
                    h(FormField, {
                        key: 'timer',
                        label: 'Event Timer (Hours)',
                        min: 1,
                        onChange: (value) => updateField('timerHours', value),
                        required: true,
                        type: 'number',
                        value: form.timerHours,
                    }),
                    h(FormField, {
                        key: 'stock',
                        label: 'Stock Limit',
                        min: 1,
                        onChange: (value) => updateField('stockLimit', value),
                        required: true,
                        type: 'number',
                        value: form.stockLimit,
                    }),
                    h('div', { className: 'modal-actions', key: 'actions' }, [
                        h(Button, { iconClass: 'fa-solid fa-bolt', key: 'save', type: 'submit' }, 'Update Flash Sale'),
                    ]),
                ]),
            ]
        );
    }

    function LineChart({ data, title, subtitle, unit, axisLabel }) {
        const [activeIndex, setActiveIndex] = useState(data.length - 1);
        const width = 680;
        const height = 260;
        const padding = { top: 24, right: 24, bottom: 48, left: 48 };
        const values = data.map((item) => item.value);
        const maxValue = Math.max(...values, 1);
        const yMax = Math.max(10, Math.ceil(maxValue / 10) * 10);
        const plotWidth = width - padding.left - padding.right;
        const plotHeight = height - padding.top - padding.bottom;
        const chartId = `chart-${slugify(title)}`;
        const ticks = [yMax, Math.round(yMax * 0.66), Math.round(yMax * 0.33), 0];
        const points = data.map((item, index) => {
            const x = padding.left + (plotWidth / Math.max(data.length - 1, 1)) * index;
            const y = padding.top + plotHeight - (item.value / yMax) * plotHeight;
            return { ...item, x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) };
        });
        const linePath = smoothPath(points);
        const fillPath = `${linePath} L ${padding.left + plotWidth},${padding.top + plotHeight} L ${padding.left},${padding.top + plotHeight} Z`;
        const activePoint = points[activeIndex] || points[points.length - 1];
        const tooltipWidth = 132;
        const tooltipHeight = 56;
        const tooltipX = Math.min(width - padding.right - tooltipWidth, Math.max(padding.left, activePoint.x - tooltipWidth / 2));
        const tooltipY = Math.max(8, activePoint.y - tooltipHeight - 14);

        return h(
            'section',
            { className: 'chart-card' },
            [
                h(
                    'div',
                    { className: 'chart-card-head', key: 'head' },
                    [
                        h('div', { key: 'copy' }, [
                            h('h3', { key: 'title' }, title),
                            h('p', { key: 'subtitle' }, subtitle),
                        ]),
                        h('span', { className: 'chart-chip', key: 'chip' }, 'Line trend'),
                    ]
                ),
                h(
                    'div',
                    { className: 'chart-frame', key: 'frame' },
                    h(
                        'svg',
                        {
                            'aria-label': `${title} line chart`,
                            className: 'line-chart',
                            onPointerLeave: () => setActiveIndex(data.length - 1),
                            role: 'img',
                            viewBox: `0 0 ${width} ${height}`,
                        },
                        [
                            h('defs', { key: 'defs' }, [
                                h(
                                    'linearGradient',
                                    { id: chartId, key: 'gradient', x1: '0', x2: '0', y1: '0', y2: '1' },
                                    [
                                        h('stop', { key: 'a', offset: '0%', stopColor: 'var(--accent)', stopOpacity: '0.34' }),
                                        h('stop', { key: 'b', offset: '68%', stopColor: 'var(--accent)', stopOpacity: '0.08' }),
                                        h('stop', { key: 'c', offset: '100%', stopColor: 'var(--accent)', stopOpacity: '0' }),
                                    ]
                                ),
                            ]),
                            h('text', { className: 'axis-title', key: 'axis-title', x: 8, y: 18 }, axisLabel || unit),
                            ticks.map((tick) => {
                                const y = padding.top + plotHeight - (tick / yMax) * plotHeight;
                                return h('g', { className: 'chart-grid', key: `tick-${tick}` }, [
                                    h('line', { key: 'line', x1: padding.left, x2: padding.left + plotWidth, y1: y, y2: y }),
                                    h('text', { key: 'text', x: padding.left - 12, y: y + 4 }, unit === '%' ? `${tick}%` : tick),
                                ]);
                            }),
                            h('path', { className: 'chart-fill', d: fillPath, fill: `url(#${chartId})`, key: 'fill' }),
                            h('path', { className: 'chart-line', d: linePath, key: 'line' }),
                            activePoint
                                ? h('line', {
                                    className: 'chart-guide',
                                    key: 'guide',
                                    x1: activePoint.x,
                                    x2: activePoint.x,
                                    y1: padding.top,
                                    y2: padding.top + plotHeight,
                                })
                                : null,
                            points.map((point, index) => (
                                h(
                                    'g',
                                    {
                                        'aria-label': `${point.label}: ${formatChartValue(point.value, unit)}`,
                                        className: cx('chart-point-group', index === activeIndex && 'active'),
                                        key: point.label,
                                        onFocus: () => setActiveIndex(index),
                                        onPointerEnter: () => setActiveIndex(index),
                                        role: 'button',
                                        tabIndex: 0,
                                    },
                                    [
                                        h('rect', {
                                            className: 'chart-hit-area',
                                            height: plotHeight + 18,
                                            key: 'hit',
                                            width: 44,
                                            x: point.x - 22,
                                            y: padding.top - 8,
                                        }),
                                        h('circle', { className: 'chart-dot', cx: point.x, cy: point.y, key: 'dot', r: index === activeIndex ? 7 : 5 }),
                                    ]
                                )
                            )),
                            data.map((item, index) => {
                                const point = points[index];
                                return h('text', { className: 'x-axis-label', key: `x-${item.label}`, x: point.x, y: height - 16 }, item.label);
                            }),
                            activePoint
                                ? h(
                                    'g',
                                    { className: 'svg-tooltip', key: 'tooltip', transform: `translate(${tooltipX}, ${tooltipY})` },
                                    [
                                        h('rect', { height: tooltipHeight, key: 'rect', rx: 8, width: tooltipWidth }),
                                        h('text', { className: 'svg-tooltip-label', key: 'label', x: 14, y: 21 }, activePoint.label),
                                        h('text', { className: 'svg-tooltip-value', key: 'value', x: 14, y: 42 }, formatChartValue(activePoint.value, unit)),
                                    ]
                                )
                                : null,
                        ]
                    )
                ),
            ]
        );
    }

    function AuthScreen({ onLogin, onOpenPortal, onSignup, status, setStatus }) {
        const [mode, setMode] = useState('login');
        const [showPassword, setShowPassword] = useState(false);
        const [login, setLogin] = useState({ email: DEFAULT_USER.email, pass: DEFAULT_USER.pass });
        const [signup, setSignup] = useState({ name: '', email: '', pass: '', confirm: '' });

        function submitLogin(event) {
            event.preventDefault();
            onLogin(login);
        }

        function submitSignup(event) {
            event.preventDefault();

            if (signup.pass !== signup.confirm) {
                setStatus('Passwords do not match.');
                return;
            }

            onSignup(signup);
        }

        return h(
            'main',
            { className: 'auth-page' },
            h(
                'section',
                { className: 'auth-card' },
                [
                    h('div', { className: 'auth-brand', key: 'brand' }, [
                        h('img', { alt: 'RF Chein Gadgets logo', key: 'logo', src: DEFAULT_USER.avatar }),
                        h('div', { key: 'copy' }, [
                            h('span', { key: 'kicker' }, 'SmartStock'),
                            h('h1', { key: 'title' }, 'RF Chein Gadgets'),
                        ]),
                    ]),
                    status ? h('p', { className: 'form-status', key: 'status' }, status) : null,
                    mode === 'login'
                        ? h(
                            'form',
                            { className: 'auth-form', key: 'login', onSubmit: submitLogin },
                            [
                                h('div', { className: 'form-heading', key: 'heading' }, [
                                    h('h2', { key: 'title' }, 'Welcome back'),
                                    h('p', { key: 'subtitle' }, 'Manage stock, units, and reports from one clean workspace.'),
                                ]),
                                h('label', { className: 'field', key: 'email' }, [
                                    h('span', { key: 'label' }, 'Email Address'),
                                    h('span', { className: 'input-shell', key: 'input' }, [
                                        icon('fa-regular fa-envelope'),
                                        h('input', {
                                            key: 'field',
                                            onChange: (event) => setLogin({ ...login, email: event.target.value }),
                                            required: true,
                                            type: 'email',
                                            value: login.email,
                                        }),
                                    ]),
                                ]),
                                h('label', { className: 'field', key: 'password' }, [
                                    h('span', { key: 'label' }, 'Password'),
                                    h('span', { className: 'input-shell', key: 'input' }, [
                                        icon('fa-solid fa-lock'),
                                        h('input', {
                                            key: 'field',
                                            onChange: (event) => setLogin({ ...login, pass: event.target.value }),
                                            required: true,
                                            type: showPassword ? 'text' : 'password',
                                            value: login.pass,
                                        }),
                                        h(
                                            'button',
                                            {
                                                'aria-label': showPassword ? 'Hide password' : 'Show password',
                                                className: 'field-icon-btn',
                                                key: 'toggle',
                                                onClick: () => setShowPassword(!showPassword),
                                                type: 'button',
                                            },
                                            icon(showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye')
                                        ),
                                    ]),
                                ]),
                                h(Button, { iconClass: 'fa-solid fa-arrow-right', key: 'submit', type: 'submit' }, 'Sign In'),
                                h('p', { className: 'auth-switch', key: 'switch' }, [
                                    'Need an account? ',
                                    h('button', { key: 'button', onClick: () => { setMode('signup'); setStatus(''); }, type: 'button' }, 'Create one'),
                                ]),
                                h(Button, { iconClass: 'fa-solid fa-store', key: 'portal', onClick: onOpenPortal, variant: 'secondary' }, 'Open Customer Portal'),
                            ]
                        )
                        : h(
                            'form',
                            { className: 'auth-form', key: 'signup', onSubmit: submitSignup },
                            [
                                h('div', { className: 'form-heading', key: 'heading' }, [
                                    h('h2', { key: 'title' }, 'Create account'),
                                    h('p', { key: 'subtitle' }, 'Set up a local SmartStock admin profile.'),
                                ]),
                                h('label', { className: 'field', key: 'name' }, [
                                    h('span', { key: 'label' }, 'Full Name'),
                                    h('span', { className: 'input-shell', key: 'input' }, [
                                        icon('fa-regular fa-user'),
                                        h('input', {
                                            key: 'field',
                                            onChange: (event) => setSignup({ ...signup, name: event.target.value }),
                                            placeholder: 'Juan Dela Cruz',
                                            required: true,
                                            type: 'text',
                                            value: signup.name,
                                        }),
                                    ]),
                                ]),
                                h('label', { className: 'field', key: 'email' }, [
                                    h('span', { key: 'label' }, 'Email Address'),
                                    h('span', { className: 'input-shell', key: 'input' }, [
                                        icon('fa-regular fa-envelope'),
                                        h('input', {
                                            key: 'field',
                                            onChange: (event) => setSignup({ ...signup, email: event.target.value }),
                                            placeholder: 'admin@rfchein.com',
                                            required: true,
                                            type: 'email',
                                            value: signup.email,
                                        }),
                                    ]),
                                ]),
                                h('label', { className: 'field', key: 'pass' }, [
                                    h('span', { key: 'label' }, 'Password'),
                                    h('span', { className: 'input-shell', key: 'input' }, [
                                        icon('fa-solid fa-lock'),
                                        h('input', {
                                            key: 'field',
                                            onChange: (event) => setSignup({ ...signup, pass: event.target.value }),
                                            required: true,
                                            type: 'password',
                                            value: signup.pass,
                                        }),
                                    ]),
                                ]),
                                h('label', { className: 'field', key: 'confirm' }, [
                                    h('span', { key: 'label' }, 'Confirm Password'),
                                    h('span', { className: 'input-shell', key: 'input' }, [
                                        icon('fa-solid fa-lock'),
                                        h('input', {
                                            key: 'field',
                                            onChange: (event) => setSignup({ ...signup, confirm: event.target.value }),
                                            required: true,
                                            type: 'password',
                                            value: signup.confirm,
                                        }),
                                    ]),
                                ]),
                                h(Button, { iconClass: 'fa-solid fa-user-plus', key: 'submit', type: 'submit' }, 'Create Account'),
                                h('p', { className: 'auth-switch', key: 'switch' }, [
                                    'Already have an account? ',
                                    h('button', { key: 'button', onClick: () => { setMode('login'); setStatus(''); }, type: 'button' }, 'Sign in'),
                                ]),
                                h(Button, { iconClass: 'fa-solid fa-store', key: 'portal', onClick: onOpenPortal, variant: 'secondary' }, 'Open Customer Portal'),
                            ]
                        ),
                ]
            )
        );
    }

    function Sidebar({ activeView, onNavigate, user }) {
        return h(
            'aside',
            { className: 'sidebar' },
            [
                h('button', { className: 'sidebar-brand', key: 'brand', onClick: () => onNavigate('home'), type: 'button' }, [
                    h('img', { alt: '', key: 'logo', src: DEFAULT_USER.avatar }),
                    h('span', { key: 'copy' }, [
                        h('small', { key: 'small' }, 'SmartStock'),
                        h('strong', { key: 'strong' }, 'RF Chein'),
                    ]),
                ]),
                h(
                    'nav',
                    { 'aria-label': 'Primary navigation', className: 'sidebar-nav', key: 'nav' },
                    NAV_ITEMS.map((item) => (
                        h(
                            'button',
                            {
                                className: cx('nav-link', activeView === item.id && 'active'),
                                key: item.id,
                                onClick: () => onNavigate(item.id),
                                type: 'button',
                            },
                            [icon(item.icon), h('span', { key: 'label' }, item.label)]
                        )
                    ))
                ),
                h('button', { className: 'sidebar-account', key: 'account', onClick: () => onNavigate('profile'), type: 'button' }, [
                    h('img', { alt: '', key: 'avatar', src: user.avatar || DEFAULT_USER.avatar }),
                    h('span', { key: 'copy' }, [
                        h('strong', { key: 'name' }, user.name),
                        h('small', { key: 'email' }, user.email),
                    ]),
                ]),
            ]
        );
    }

    function TopBar({ activeView, notifications, onNavigate, onNotify, user }) {
        const label = NAV_ITEMS.find((item) => item.id === activeView)?.label || 'Dashboard';

        return h(
            'header',
            { className: 'top-bar' },
            [
                h('div', { className: 'top-title', key: 'title' }, [
                    h('span', { key: 'kicker' }, 'Dashboard'),
                    h('h2', { key: 'label' }, label),
                ]),
                h('div', { className: 'top-actions', key: 'actions' }, [
                    h('span', { className: 'live-pill', key: 'live' }, [h('span', { key: 'dot' }), 'Live']),
                    h(IconButton, {
                        iconClass: notifications ? 'fa-regular fa-bell' : 'fa-solid fa-bell-slash',
                        key: 'notify',
                        label: 'Notifications',
                        onClick: onNotify,
                    }),
                    h('button', { className: 'top-profile', key: 'profile', onClick: () => onNavigate('profile'), type: 'button' }, [
                        h('img', { alt: '', key: 'avatar', src: user.avatar || DEFAULT_USER.avatar }),
                        h('span', { key: 'copy' }, [
                            h('small', { key: 'small' }, 'Welcome back'),
                            h('strong', { key: 'strong' }, user.name),
                        ]),
                    ]),
                ]),
            ]
        );
    }

    function BottomNav({ activeView, onNavigate }) {
        return h(
            'nav',
            { 'aria-label': 'Mobile navigation', className: 'bottom-nav' },
            NAV_ITEMS.map((item) => (
                h(
                    'button',
                    {
                        className: cx('bottom-nav-btn', activeView === item.id && 'active'),
                        key: item.id,
                        onClick: () => onNavigate(item.id),
                        type: 'button',
                    },
                    [icon(item.icon), h('span', { key: 'label' }, item.label)]
                )
            ))
        );
    }

    function PublicPortalShell({ inventory, onAdminSignIn, onInquiry, onReserve }) {
        return h(
            'div',
            { className: 'public-shell' },
            [
                h('header', { className: 'public-top', key: 'top' }, [
                    h('button', { className: 'public-brand', key: 'brand', type: 'button' }, [
                        h('img', { alt: '', key: 'logo', src: DEFAULT_USER.avatar }),
                        h('span', { key: 'copy' }, [
                            h('small', { key: 'small' }, 'SmartStock'),
                            h('strong', { key: 'strong' }, 'RF Chein Customer Portal'),
                        ]),
                    ]),
                    h(Button, { iconClass: 'fa-solid fa-lock', key: 'admin', onClick: onAdminSignIn, variant: 'secondary' }, 'Admin Sign In'),
                ]),
                h('main', { className: 'content-area public-content', key: 'content' }, h(CustomerPortalPage, {
                    inventory,
                    onInquiry,
                    onNavigate: onAdminSignIn,
                    onPortalAction: onAdminSignIn,
                    onReserve,
                    portalActionLabel: 'Admin Sign In',
                })),
            ]
        );
    }

    function HomePage({ flashSaleConfig, inventory, onAddProduct, onNavigate, onUpdateFlashSaleConfig, stockTrend }) {
        const stats = summarizeInventory(inventory);

        return h(
            'div',
            { className: 'page-stack' },
            [
                h('section', { className: 'hero-panel', key: 'hero' }, [
                    h('div', { key: 'copy' }, [
                        h('span', { className: 'eyebrow', key: 'eyebrow' }, 'Store Overview'),
                        h('h1', { key: 'title' }, 'Inventory performance is steady today.'),
                        h('p', { key: 'subtitle' }, 'Monitor stock movement, reorder signals, and unit trends with a focused SmartStock workspace.'),
                    ]),
                    h(Button, { iconClass: 'fa-solid fa-plus', key: 'button', onClick: onAddProduct }, 'Add Stock'),
                ]),
                h(FlashSaleConfigPanel, { config: flashSaleConfig, inventory, key: 'flash-sale-config', onSave: onUpdateFlashSaleConfig }),
                h(FlashSalesPanel, { config: flashSaleConfig, inventory, key: 'flash-sales', onNavigate }),
                h('div', { className: 'stats-grid', key: 'stats' }, [
                    h(StatCard, { iconClass: 'fa-solid fa-boxes-stacked', key: 'units', label: 'Total Units', note: '+8% this week', tone: 'green', value: stats.totalUnits }),
                    h(StatCard, { iconClass: 'fa-solid fa-triangle-exclamation', key: 'low', label: 'Low Stock', note: `${stats.outOfStock} out of stock`, tone: 'amber', value: stats.lowStock }),
                    h(StatCard, { iconClass: 'fa-solid fa-list-check', key: 'models', label: 'Models Tracked', note: `${stats.brands} active brands`, tone: 'blue', value: stats.models }),
                ]),
                h(LineChart, { axisLabel: 'Units', data: stockTrend, key: 'chart', subtitle: 'Units in inventory update whenever stock changes.', title: 'Stock Level Trend', unit: 'units' }),
                h('section', { className: 'quick-grid', key: 'quick' }, [
                    h('button', { className: 'quick-card', key: 'portal', onClick: () => onNavigate('portal'), type: 'button' }, [
                        icon('fa-solid fa-store'),
                        h('span', { key: 'copy' }, [
                            h('strong', { key: 'title' }, 'Customer Portal'),
                            h('small', { key: 'text' }, 'Showcase products'),
                        ]),
                    ]),
                    h('button', { className: 'quick-card', key: 'inventory', onClick: () => onNavigate('inventory'), type: 'button' }, [
                        icon('fa-solid fa-cube'),
                        h('span', { key: 'copy' }, [
                            h('strong', { key: 'title' }, 'Inventory'),
                            h('small', { key: 'text' }, 'Review product levels'),
                        ]),
                    ]),
                    h('button', { className: 'quick-card', key: 'tickets', onClick: () => onNavigate('tickets'), type: 'button' }, [
                        icon('fa-solid fa-comments'),
                        h('span', { key: 'copy' }, [
                            h('strong', { key: 'title' }, 'Inquiry Tickets'),
                            h('small', { key: 'text' }, 'Reply to customers'),
                        ]),
                    ]),
                    h('button', { className: 'quick-card', key: 'branches', onClick: () => onNavigate('branches'), type: 'button' }, [
                        icon('fa-solid fa-network-wired'),
                        h('span', { key: 'copy' }, [
                            h('strong', { key: 'title' }, 'Branch Network'),
                            h('small', { key: 'text' }, 'Sync locations'),
                        ]),
                    ]),
                    h('button', { className: 'quick-card', key: 'analytics', onClick: () => onNavigate('analytics'), type: 'button' }, [
                        icon('fa-solid fa-chart-line'),
                        h('span', { key: 'copy' }, [
                            h('strong', { key: 'title' }, 'Full Report'),
                            h('small', { key: 'text' }, 'Open analytics trends'),
                        ]),
                    ]),
                ]),
            ]
        );
    }

    function InventoryPage({ inventory, onAddProduct, onDeleteProduct, onEditProduct }) {
        const [query, setQuery] = useState('');
        const [filter, setFilter] = useState('all');
        const filters = [
            { id: 'all', label: 'All' },
            { id: 'ios', label: 'iOS' },
            { id: 'android', label: 'Android' },
            { id: 'low', label: 'Low Stock' },
            { id: 'out', label: 'Out' },
        ];
        const filteredInventory = inventory.filter((item) => {
            const quantity = safeQuantity(item.quantity);
            const status = getStatus(quantity).className;
            const search = `${item.model} ${item.brand} ${item.specs}`.toLowerCase();
            const matchesSearch = search.includes(query.trim().toLowerCase());
            const matchesFilter = filter === 'all' || item.platform === filter || status === filter;
            return matchesSearch && matchesFilter;
        });

        return h(
            'div',
            { className: 'page-stack' },
            [
                h('div', { className: 'page-head', key: 'head' }, [
                    h('div', { key: 'copy' }, [
                        h('span', { className: 'eyebrow', key: 'eyebrow' }, 'Catalog Management'),
                        h('h1', { key: 'title' }, 'Inventory'),
                        h('p', { key: 'subtitle' }, `${inventory.length} models tracked`),
                    ]),
                    h(Button, { iconClass: 'fa-solid fa-plus', key: 'add', onClick: onAddProduct }, 'Add Product'),
                ]),
                h('section', { className: 'control-card', key: 'controls' }, [
                    h('label', { className: 'search-field', key: 'search' }, [
                        icon('fa-solid fa-magnifying-glass'),
                        h('input', {
                            'aria-label': 'Search inventory',
                            key: 'input',
                            onChange: (event) => setQuery(event.target.value),
                            placeholder: 'Search model, brand, or specs',
                            type: 'search',
                            value: query,
                        }),
                    ]),
                    h('div', { className: 'segmented', key: 'filters' }, filters.map((item) => (
                        h(
                            'button',
                            {
                                className: cx(filter === item.id && 'active'),
                                key: item.id,
                                onClick: () => setFilter(item.id),
                                type: 'button',
                            },
                            item.label
                        )
                    ))),
                ]),
                h(
                    'section',
                    { className: 'inventory-grid', key: 'grid' },
                    filteredInventory.length
                        ? filteredInventory.map((item) => (
                            h(ProductCard, {
                                item,
                                key: item.id,
                                onDelete: () => onDeleteProduct(item),
                                onEdit: () => onEditProduct(item),
                            })
                        ))
                        : h('p', { className: 'empty-state' }, 'No products match the current filters.')
                ),
            ]
        );
    }

    function ProductCard({ item, onDelete, onEdit }) {
        const quantity = safeQuantity(item.quantity);
        const status = getStatus(quantity);

        return h(
            'article',
            { className: 'product-card' },
            [
                item.image ? h('div', { className: 'product-image', key: 'image' }, [
                    h('img', { alt: item.model, key: 'img', src: item.image }),
                ]) : null,
                h('div', { className: 'product-main', key: 'main' }, [
                    h('span', { className: 'product-icon', key: 'icon' }, icon(item.platform === 'ios' ? 'fa-brands fa-apple' : 'fa-brands fa-android')),
                    h('div', { key: 'copy' }, [
                        h('h3', { key: 'model' }, item.model),
                        h('p', { key: 'brand' }, `${item.brand} - ${item.specs}`),
                    ]),
                ]),
                h('div', { className: 'product-meta', key: 'meta' }, [
                    h('span', { className: cx('status-pill', status.className), key: 'status' }, status.label),
                    h('strong', { key: 'qty' }, `${quantity} units`),
                ]),
                h('div', { className: 'product-actions', key: 'actions' }, [
                    h(IconButton, { iconClass: 'fa-regular fa-pen-to-square', key: 'edit', label: 'Edit product', onClick: onEdit }),
                    h(IconButton, { iconClass: 'fa-regular fa-trash-can', key: 'delete', label: 'Delete product', onClick: onDelete, tone: 'danger' }),
                ]),
            ]
        );
    }

    function CustomerPortalPage({ inventory, onInquiry, onNavigate, onPortalAction, onReserve, portalActionLabel }) {
        const [query, setQuery] = useState('');
        const [platform, setPlatform] = useState('all');
        const featured = inventory.slice(0, 3);
        const visibleProducts = inventory.filter((item) => {
            const search = `${item.model} ${item.brand} ${item.specs} ${item.category}`.toLowerCase();
            const matchesSearch = search.includes(query.trim().toLowerCase());
            const matchesPlatform = platform === 'all' || item.platform === platform;
            return matchesSearch && matchesPlatform;
        });

        return h(
            'div',
            { className: 'page-stack customer-portal' },
            [
                h('section', { className: 'portal-hero', key: 'hero' }, [
                    h('div', { key: 'copy' }, [
                        h('span', { className: 'eyebrow', key: 'eyebrow' }, 'Customer Portal'),
                        h('h1', { key: 'title' }, 'Find your next gadget before it sells out.'),
                        h('p', { key: 'subtitle' }, 'Browse live RF Chein Gadgets inventory, reserve available units, or send a product question directly to the admin team.'),
                    ]),
                    h('div', { className: 'portal-actions', key: 'actions' }, [
                        h(Button, { iconClass: 'fa-solid fa-bag-shopping', key: 'reserve', onClick: () => onReserve(featured[0] || inventory[0]) }, 'Reserve Featured'),
                        h(Button, { iconClass: 'fa-solid fa-comments', key: 'tickets', onClick: onPortalAction || (() => onNavigate('tickets')), variant: 'secondary' }, portalActionLabel || 'Admin Replies'),
                    ]),
                ]),
                h('section', { className: 'featured-strip', key: 'featured' }, featured.map((item) => (
                    h('article', { className: 'featured-product', key: item.id }, [
                        item.image ? h('img', { alt: item.model, className: 'featured-image', key: 'img', src: item.image }) : h('span', { key: 'icon' }, icon(item.platform === 'ios' ? 'fa-brands fa-apple' : 'fa-brands fa-android')),
                        h('div', { key: 'copy' }, [
                            h('strong', { key: 'model' }, item.model),
                            h('small', { key: 'meta' }, `${item.brand} - ${safeQuantity(item.quantity)} units`),
                        ]),
                    ])
                ))),
                h('section', { className: 'control-card', key: 'controls' }, [
                    h('label', { className: 'search-field', key: 'search' }, [
                        icon('fa-solid fa-magnifying-glass'),
                        h('input', {
                            'aria-label': 'Search customer catalog',
                            key: 'input',
                            onChange: (event) => setQuery(event.target.value),
                            placeholder: 'Search models, brands, or specs',
                            type: 'search',
                            value: query,
                        }),
                    ]),
                    h('div', { className: 'segmented', key: 'segments' }, [
                        h('button', { className: cx(platform === 'all' && 'active'), key: 'all', onClick: () => setPlatform('all'), type: 'button' }, 'All'),
                        h('button', { className: cx(platform === 'ios' && 'active'), key: 'ios', onClick: () => setPlatform('ios'), type: 'button' }, 'iOS'),
                        h('button', { className: cx(platform === 'android' && 'active'), key: 'android', onClick: () => setPlatform('android'), type: 'button' }, 'Android'),
                    ]),
                ]),
                h(
                    'section',
                    { className: 'catalog-grid', key: 'catalog' },
                    visibleProducts.length
                        ? visibleProducts.map((item) => (
                            h(CustomerProductCard, {
                                item,
                                key: item.id,
                                onInquiry: () => onInquiry(item),
                                onReserve: () => onReserve(item),
                            })
                        ))
                        : h('p', { className: 'empty-state' }, 'No catalog items match your search.')
                ),
            ]
        );
    }

    function CustomerProductCard({ item, onInquiry, onReserve }) {
        const quantity = safeQuantity(item.quantity);
        const available = quantity > 0;

        return h(
            'article',
            { className: 'catalog-card' },
            [
                h('div', { className: 'catalog-visual', key: 'visual' }, [
                    item.image ? h('img', { alt: item.model, key: 'img', src: item.image }) : [
                        icon(item.platform === 'ios' ? 'fa-brands fa-apple' : 'fa-brands fa-android'),
                    ],
                    h('span', { key: 'tag' }, item.category),
                ]),
                h('div', { className: 'catalog-copy', key: 'copy' }, [
                    h('h3', { key: 'model' }, item.model),
                    h('p', { key: 'specs' }, `${item.brand} - ${item.specs}`),
                ]),
                h('div', { className: 'catalog-meta', key: 'meta' }, [
                    h('strong', { key: 'quantity' }, available ? `${quantity} available` : 'Unavailable'),
                    h('small', { key: 'condition' }, item.condition),
                ]),
                h('div', { className: 'catalog-actions', key: 'actions' }, [
                    h(Button, { iconClass: 'fa-solid fa-bookmark', key: 'reserve', onClick: onReserve }, available ? 'Reserve' : 'Join Waitlist'),
                    h(Button, { iconClass: 'fa-regular fa-message', key: 'inquiry', onClick: onInquiry, variant: 'secondary' }, 'Ask'),
                ]),
            ]
        );
    }

    function TicketCenterPage({ onReply, onStatusChange, tickets }) {
        const [filter, setFilter] = useState('all');
        const counts = {
            all: tickets.length,
            open: tickets.filter((ticket) => ticket.status !== 'Closed').length,
            closed: tickets.filter((ticket) => ticket.status === 'Closed').length,
        };
        const visibleTickets = tickets.filter((ticket) => (
            filter === 'all' || (filter === 'open' ? ticket.status !== 'Closed' : ticket.status === 'Closed')
        ));

        return h(
            'div',
            { className: 'page-stack' },
            [
                h('div', { className: 'page-head', key: 'head' }, [
                    h('div', { key: 'copy' }, [
                        h('span', { className: 'eyebrow', key: 'eyebrow' }, 'Admin Support'),
                        h('h1', { key: 'title' }, 'Inquiry Tickets'),
                        h('p', { key: 'subtitle' }, 'Centralized customer messages, reservations, and branch concerns.'),
                    ]),
                ]),
                h('div', { className: 'stats-grid compact', key: 'stats' }, [
                    h(StatCard, { iconClass: 'fa-solid fa-inbox', key: 'all', label: 'Total Tickets', note: 'All sources', tone: 'green', value: counts.all }),
                    h(StatCard, { iconClass: 'fa-solid fa-clock', key: 'open', label: 'Needs Response', note: `${counts.closed} closed`, tone: 'amber', value: counts.open }),
                ]),
                h('section', { className: 'control-card ticket-controls', key: 'controls' }, [
                    h('div', { className: 'segmented', key: 'filters' }, [
                        h('button', { className: cx(filter === 'all' && 'active'), key: 'all', onClick: () => setFilter('all'), type: 'button' }, 'All'),
                        h('button', { className: cx(filter === 'open' && 'active'), key: 'open', onClick: () => setFilter('open'), type: 'button' }, 'Open'),
                        h('button', { className: cx(filter === 'closed' && 'active'), key: 'closed', onClick: () => setFilter('closed'), type: 'button' }, 'Closed'),
                    ]),
                ]),
                h(
                    'section',
                    { className: 'ticket-list', key: 'tickets' },
                    visibleTickets.length
                        ? visibleTickets.map((ticket) => (
                            h(TicketCard, {
                                key: ticket.id,
                                onReply: () => onReply(ticket),
                                onStatusChange: () => onStatusChange(ticket.id, ticket.status === 'Closed' ? 'Open' : 'Closed'),
                                ticket,
                            })
                        ))
                        : h('p', { className: 'empty-state' }, 'No tickets in this view.')
                ),
            ]
        );
    }

    function TicketCard({ onReply, onStatusChange, ticket }) {
        return h(
            'article',
            { className: 'ticket-card' },
            [
                h('header', { key: 'head' }, [
                    h('span', { className: cx('ticket-type', ticket.type.toLowerCase()), key: 'type' }, ticket.type),
                    h('span', { className: cx('ticket-status', ticket.status.toLowerCase()), key: 'status' }, ticket.status),
                ]),
                h('div', { className: 'ticket-body', key: 'body' }, [
                    h('h3', { key: 'customer' }, ticket.customer),
                    h('p', { key: 'product' }, ticket.product),
                    h('blockquote', { key: 'message' }, ticket.message),
                    ticket.reply ? h('div', { className: 'ticket-reply', key: 'reply' }, [h('strong', { key: 'label' }, 'Admin reply'), h('p', { key: 'text' }, ticket.reply)]) : null,
                ]),
                h('footer', { key: 'footer' }, [
                    h('small', { key: 'meta' }, `${ticket.createdAt} - ${ticket.priority} priority`),
                    h('span', { key: 'actions' }, [
                        h(Button, { iconClass: 'fa-solid fa-reply', key: 'reply', onClick: onReply }, ticket.reply ? 'Update Reply' : 'Reply'),
                        h(Button, { iconClass: 'fa-solid fa-check', key: 'status', onClick: onStatusChange, variant: 'secondary' }, ticket.status === 'Closed' ? 'Reopen' : 'Close'),
                    ]),
                ]),
            ]
        );
    }

    function BranchNetworkPage({ branches, onBranchMessage, onBranchSync }) {
        const onlineCount = branches.filter((branch) => branch.status !== 'Offline').length;
        const totalInventory = branches.reduce((sum, branch) => sum + safeQuantity(branch.inventory), 0);

        return h(
            'div',
            { className: 'page-stack branch-page' },
            [
                h('section', { className: 'branch-hero', key: 'hero' }, [
                    h('div', { key: 'copy' }, [
                        h('span', { className: 'eyebrow', key: 'eyebrow' }, 'Inter-Branch Connectivity'),
                        h('h1', { key: 'title' }, 'Connect every RF Chein branch to headquarters.'),
                        h('p', { key: 'subtitle' }, 'Coordinate inventory, branch messages, and secure sync activity from one operational network.'),
                    ]),
                    h(Button, { iconClass: 'fa-solid fa-arrows-rotate', key: 'sync', onClick: () => branches.forEach((branch) => onBranchSync(branch.id)) }, 'Sync Network'),
                ]),
                h('div', { className: 'stats-grid compact', key: 'stats' }, [
                    h(StatCard, { iconClass: 'fa-solid fa-signal', key: 'online', label: 'Connected Branches', note: `${branches.length} total nodes`, tone: 'green', value: onlineCount }),
                    h(StatCard, { iconClass: 'fa-solid fa-boxes-stacked', key: 'stock', label: 'Network Units', note: 'Synced inventory pool', tone: 'blue', value: totalInventory }),
                ]),
                h(
                    'section',
                    { className: 'branch-grid', key: 'branches' },
                    branches.map((branch) => (
                        h(BranchCard, {
                            branch,
                            key: branch.id,
                            onMessage: () => onBranchMessage(branch),
                            onSync: () => onBranchSync(branch.id),
                        })
                    ))
                ),
            ]
        );
    }

    function BranchCard({ branch, onMessage, onSync }) {
        return h(
            'article',
            { className: 'branch-card' },
            [
                h('header', { key: 'head' }, [
                    h('span', { className: 'branch-icon', key: 'icon' }, icon(branch.id === 'main' ? 'fa-solid fa-building-shield' : 'fa-solid fa-store')),
                    h('span', { key: 'copy' }, [
                        h('h3', { key: 'name' }, branch.name),
                        h('small', { key: 'location' }, branch.location),
                    ]),
                    h('b', { className: cx('branch-status', branch.status.toLowerCase()), key: 'status' }, branch.status),
                ]),
                h('dl', { key: 'data' }, [
                    h('div', { key: 'manager' }, [h('dt', { key: 'dt' }, 'Manager'), h('dd', { key: 'dd' }, branch.manager)]),
                    h('div', { key: 'sync' }, [h('dt', { key: 'dt' }, 'Last Sync'), h('dd', { key: 'dd' }, branch.lastSync)]),
                    h('div', { key: 'inventory' }, [h('dt', { key: 'dt' }, 'Units'), h('dd', { key: 'dd' }, branch.inventory)]),
                    h('div', { key: 'tickets' }, [h('dt', { key: 'dt' }, 'Open Tickets'), h('dd', { key: 'dd' }, branch.tickets)]),
                ]),
                h('footer', { key: 'footer' }, [
                    h(Button, { iconClass: 'fa-solid fa-shield-halved', key: 'sync', onClick: onSync }, 'Secure Sync'),
                    h(Button, { iconClass: 'fa-regular fa-message', key: 'message', onClick: onMessage, variant: 'secondary' }, 'Message'),
                ]),
            ]
        );
    }

    function UnitsPage() {
        const activity = [
            { label: 'Added to stock', note: 'Received inventory', value: '+72', tone: 'positive' },
            { label: 'Sold units', note: 'Completed checkout', value: '-31' },
            { label: 'Returned units', note: 'Customer returns', value: '+4', tone: 'positive' },
            { label: 'Damaged tagged', note: 'For review', value: '2', tone: 'warning' },
        ];

        return h(
            'div',
            { className: 'page-stack' },
            [
                h('div', { className: 'page-head', key: 'head' }, [
                    h('div', { key: 'copy' }, [
                        h('span', { className: 'eyebrow', key: 'eyebrow' }, 'Movement'),
                        h('h1', { key: 'title' }, 'Units'),
                        h('p', { key: 'subtitle' }, 'Track product movement over time.'),
                    ]),
                ]),
                h(LineChart, { axisLabel: 'Units', data: CHARTS.units, key: 'chart', subtitle: 'Monthly movement pattern for checked units.', title: 'Unit Movement Trend', unit: 'units' }),
                h('section', { className: 'list-card', key: 'list' }, activity.map((item) => (
                    h('article', { className: 'list-row', key: item.label }, [
                        h('span', { key: 'copy' }, [
                            h('strong', { key: 'label' }, item.label),
                            h('small', { key: 'note' }, item.note),
                        ]),
                        h('b', { className: item.tone || '', key: 'value' }, item.value),
                    ])
                ))),
            ]
        );
    }

    function CustomersPage() {
        const customers = [
            { name: 'John Francis Busel', note: 'Repeat buyer', orders: '5 orders' },
            { name: 'Almera Ex', note: 'Installment inquiry', orders: '3 orders' },
            { name: 'Aljhon Mansueto', note: 'Accessory bundle', orders: '2 orders' },
            { name: 'Andrew', note: 'New customer', orders: '1 order' },
        ];

        return h(
            'div',
            { className: 'page-stack' },
            [
                h('div', { className: 'page-head', key: 'head' }, [
                    h('div', { key: 'copy' }, [
                        h('span', { className: 'eyebrow', key: 'eyebrow' }, 'People'),
                        h('h1', { key: 'title' }, 'Customers'),
                        h('p', { key: 'subtitle' }, 'Recent order activity and customer patterns.'),
                    ]),
                ]),
                h(LineChart, { axisLabel: 'Orders', data: CHARTS.customers, key: 'chart', subtitle: 'Weekly customer order trend.', title: 'Customer Activity Trend', unit: 'orders' }),
                h('section', { className: 'customer-grid', key: 'customers' }, customers.map((customer) => (
                    h('article', { className: 'customer-card', key: customer.name }, [
                        h('span', { className: 'customer-avatar', key: 'avatar' }, customer.name.split(' ').map((part) => part[0]).join('').slice(0, 2)),
                        h('span', { key: 'copy' }, [
                            h('strong', { key: 'name' }, customer.name),
                            h('small', { key: 'note' }, customer.note),
                        ]),
                        h('b', { key: 'orders' }, customer.orders),
                    ])
                ))),
            ]
        );
    }

    function AnalyticsPage({ inventory }) {
        const [range, setRange] = useState('6m');
        const rangeOptions = [
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: '6m', label: 'Last 6 Months' },
        ];

        const filteredAccuracy = filterSeriesByRange(CHARTS.accuracy, range);
        const filteredCategory = filterSeriesByRange(CHARTS.category, range);
        const filteredUnits = filterSeriesByRange(CHARTS.units, range);
        const filteredCustomers = filterSeriesByRange(CHARTS.customers, range);
        const overview = summarizeDescriptiveAnalytics(inventory);
        const scopedOverview = {
            ...overview,
            accuracySeries: describeSeries(filteredAccuracy),
            inventorySeries: describeSeries(filteredCategory),
            movementSeries: describeSeries(filteredUnits),
            salesSeries: describeSeries(filteredCustomers),
        };
        const selectedRangeLabel = rangeOptions.find((option) => option.id === range)?.label || 'Last 6 Months';
        const selectedRangeSpan = filteredCategory.length
            ? `${filteredCategory[0].label} - ${filteredCategory[filteredCategory.length - 1].label}`
            : 'No data';
        const maxProductUnits = Math.max(...overview.topProducts.map((item) => item.quantity), 1);

        return h(
            'div',
            { className: 'page-stack' },
            [
                h('div', { className: 'page-head', key: 'head' }, [
                    h('div', { key: 'copy' }, [
                        h('span', { className: 'eyebrow', key: 'eyebrow' }, 'Descriptive Analytics'),
                        h('h1', { key: 'title' }, 'Historical Performance Dashboard'),
                        h('p', { key: 'subtitle' }, 'Understand past inventory and sales activity through trend summaries, movement snapshots, and product visibility insights.'),
                    ]),
                    h('div', { className: 'segmented analytics-range-controls', key: 'range' }, rangeOptions.map((option) => (
                        h(
                            'button',
                            {
                                className: cx(range === option.id && 'active'),
                                key: option.id,
                                onClick: () => setRange(option.id),
                                type: 'button',
                            },
                            option.label
                        )
                    ))),
                ]),
                h('div', { className: 'stats-grid compact', key: 'stats' }, [
                    h(StatCard, { iconClass: 'fa-solid fa-clipboard-check', key: 'accuracy', label: 'Stock Accuracy', note: `${filteredAccuracy[filteredAccuracy.length - 1]?.value || 0}% in selected period`, tone: 'green', value: `${Math.round(scopedOverview.accuracySeries.average)}%` }),
                    h(StatCard, { iconClass: 'fa-solid fa-clock-rotate-left', key: 'movement', label: 'Avg Unit Movement', note: `${scopedOverview.movementSeries.growthLabel} across selected period`, tone: 'blue', value: `${Math.round(scopedOverview.movementSeries.average)} units` }),
                    h(StatCard, { iconClass: 'fa-solid fa-cart-shopping', key: 'sales', label: 'Avg Weekly Sales', note: `${scopedOverview.salesSeries.growthLabel} in customer orders`, tone: 'green', value: `${Math.round(scopedOverview.salesSeries.average)} orders` }),
                ]),
                h(InventoryByBrandDonut, { inventory, key: 'brand-donut' }),
                h('div', { className: 'analytics-period-badge', key: 'period-badge' }, [
                    h('i', { className: 'fa-regular fa-calendar-days', key: 'icon', 'aria-hidden': 'true' }),
                    h('span', { key: 'label' }, `Showing: ${selectedRangeLabel}`),
                    h('small', { key: 'span' }, selectedRangeSpan),
                ]),
                h('div', { className: 'chart-grid-two', key: 'charts' }, [
                    h(LineChart, { axisLabel: 'Accuracy', data: filteredAccuracy, key: 'accuracy-chart', subtitle: 'Stock count accuracy within the selected date range.', title: 'Accuracy Trend', unit: '%' }),
                    h(LineChart, { axisLabel: 'Units', data: filteredCategory, key: 'category-chart', subtitle: 'Category stock movement within the selected date range.', title: 'Category Stock Trend', unit: 'units' }),
                ]),
                h('section', { className: 'analytics-insight-grid', key: 'insights' }, [
                    h('article', { className: 'list-card analytics-summary-card', key: 'summary' }, [
                        h('header', { className: 'analytics-card-head', key: 'head' }, [
                            h('strong', { key: 'title' }, 'Historical Summary'),
                            h('small', { key: 'note' }, 'Inventory and sales baseline'),
                        ]),
                        h('div', { className: 'list-row', key: 'inventory-growth' }, [
                            h('span', { key: 'copy' }, [
                                h('strong', { key: 'label' }, 'Inventory trend change'),
                                h('small', { key: 'note' }, `From ${scopedOverview.inventorySeries.first} to ${scopedOverview.inventorySeries.last} units`),
                            ]),
                            h('b', { className: scopedOverview.inventorySeries.change >= 0 ? 'positive' : '', key: 'value' }, `${scopedOverview.inventorySeries.change >= 0 ? '+' : ''}${scopedOverview.inventorySeries.change}`),
                        ]),
                        h('div', { className: 'list-row', key: 'sales-growth' }, [
                            h('span', { key: 'copy' }, [
                                h('strong', { key: 'label' }, 'Sales activity trend'),
                                h('small', { key: 'note' }, `From ${scopedOverview.salesSeries.first} to ${scopedOverview.salesSeries.last} weekly orders`),
                            ]),
                            h('b', { className: scopedOverview.salesSeries.change >= 0 ? 'positive' : '', key: 'value' }, `${scopedOverview.salesSeries.change >= 0 ? '+' : ''}${scopedOverview.salesSeries.change}`),
                        ]),
                        h('div', { className: 'list-row', key: 'avg-stock' }, [
                            h('span', { key: 'copy' }, [
                                h('strong', { key: 'label' }, 'Average stock per model'),
                                h('small', { key: 'note' }, `${overview.totalUnits} total units tracked`),
                            ]),
                            h('b', { key: 'value' }, `${Math.round(overview.avgUnitsPerModel)} units`),
                        ]),
                        h('div', { className: 'list-row', key: 'low-stock-risk' }, [
                            h('span', { key: 'copy' }, [
                                h('strong', { key: 'label' }, 'Low-stock exposure'),
                                h('small', { key: 'note' }, 'Products needing restock attention'),
                            ]),
                            h('b', { className: overview.lowStock > 0 ? 'warning' : 'positive', key: 'value' }, String(overview.lowStock)),
                        ]),
                    ]),
                    h('article', { className: 'list-card analytics-movement-card', key: 'movement-table' }, [
                        h('header', { className: 'analytics-card-head', key: 'head' }, [
                            h('strong', { key: 'title' }, 'Top Product Movement'),
                            h('small', { key: 'note' }, `Peak period: ${scopedOverview.inventorySeries.peak.label} (${scopedOverview.inventorySeries.peak.value} units)`),
                        ]),
                        ...overview.topProducts.map((item) => (
                            h('article', { className: 'analytics-movement-row', key: item.model }, [
                                h('div', { className: 'analytics-movement-copy', key: 'copy' }, [
                                    h('strong', { key: 'model' }, item.model),
                                    h('small', { key: 'meta' }, `${item.brand} · ${item.quantity} units`),
                                ]),
                                h('div', { className: 'analytics-progress', key: 'progress' }, [
                                    h('span', {
                                        key: 'bar',
                                        style: { width: `${Math.max(14, (item.quantity / maxProductUnits) * 100)}%` },
                                    }),
                                ]),
                            ])
                        )),
                    ]),
                ]),
            ]
        );
    }

    function ProfilePage({ activeView, notifications, onEditProfile, onInfo, onNavigate, onNotificationsChange, onSignOut, onThemeChange, stats, theme, user }) {
        const isDark = theme === 'dark';

        return h(
            'section',
            { className: 'profile-page' },
            h(
                'div',
                { className: 'profile-phone' },
                [
                    h('div', { className: 'phone-status', key: 'status' }, [
                        h('span', { key: 'time' }, '9:41'),
                        h('span', { className: 'status-icons', key: 'icons' }, [
                            h('span', { className: 'signal', key: 'signal' }, [h('i', { key: 'a' }), h('i', { key: 'b' }), h('i', { key: 'c' })]),
                            h('i', { className: 'fa-solid fa-wifi', key: 'wifi', 'aria-hidden': 'true' }),
                            h('span', { className: 'battery', key: 'battery' }),
                        ]),
                    ]),
                    h('div', { className: 'profile-hero', key: 'hero' }, [
                        h('button', { className: 'profile-avatar', key: 'avatar', onClick: onEditProfile, type: 'button' }, [
                            h('img', { alt: `${user.name} profile`, key: 'img', src: user.avatar || DEFAULT_USER.avatar }),
                            h('span', { key: 'badge' }, icon('fa-solid fa-camera')),
                        ]),
                        h('div', { className: 'profile-copy', key: 'copy' }, [
                            h('h1', { key: 'name' }, user.name),
                            h('p', { key: 'email' }, user.email),
                            h('strong', { key: 'role' }, [h('span', { key: 'dot' }), `${user.role || 'Admin'} - ${user.store || 'RF Chein Gadgets'}`]),
                        ]),
                    ]),
                    h('div', { className: 'profile-stats', key: 'stats' }, [
                        h('article', { key: 'models' }, [h('strong', { key: 'value' }, stats.models), h('span', { key: 'label' }, 'Models')]),
                        h('article', { key: 'units' }, [h('strong', { key: 'value' }, stats.totalUnits), h('span', { key: 'label' }, 'Total Units')]),
                        h('article', { key: 'brands' }, [h('strong', { key: 'value' }, stats.brands), h('span', { key: 'label' }, 'Brands')]),
                    ]),
                    h(ProfileSection, {
                        key: 'store',
                        label: 'Store',
                        rows: [
                            { iconClass: 'fa-solid fa-store', label: 'Store Information', onClick: () => onInfo('Store Information', 'RF Chein Gadgets inventory settings are ready.') },
                            { iconClass: 'fa-regular fa-bell', label: 'Notifications', toggle: true, checked: notifications, onToggle: onNotificationsChange },
                        ],
                    }),
                    h(ProfileSection, {
                        key: 'appearance',
                        label: 'Appearance',
                        rows: [
                            { iconClass: 'fa-solid fa-moon', label: `Dark Mode (${isDark ? 'On' : 'Off'})`, toggle: true, checked: isDark, onToggle: (checked) => onThemeChange(checked ? 'dark' : 'light') },
                        ],
                    }),
                    h(ProfileSection, {
                        key: 'support',
                        label: 'Support',
                        rows: [
                            { iconClass: 'fa-regular fa-circle-question', label: 'Help & FAQ', onClick: () => onInfo('Help & FAQ', 'Stock actions, profile settings, and reports are available from this dashboard.') },
                            { iconClass: 'fa-solid fa-shield-halved', label: 'Privacy Policy', onClick: () => onInfo('Privacy Policy', 'SmartStock stores local preferences and demo inventory in this browser.') },
                            { iconClass: 'fa-regular fa-circle-info', label: 'About RF Chein', onClick: () => onInfo('About RF Chein', 'RF Chein Gadgets v2.0 Inventory System.') },
                        ],
                    }),
                    h('button', { className: 'sign-out-btn', key: 'signout', onClick: onSignOut, type: 'button' }, [
                        icon('fa-solid fa-arrow-right-from-bracket'),
                        h('span', { key: 'label' }, 'Sign Out'),
                    ]),
                    h('p', { className: 'profile-version', key: 'version' }, 'RF Chein Gadgets v2.0 - Inventory System'),
                    h(
                        'nav',
                        { 'aria-label': 'Profile navigation', className: 'profile-bottom-nav', key: 'nav' },
                        NAV_ITEMS.map((item) => (
                            h(
                                'button',
                                {
                                    className: cx(activeView === item.id && 'active'),
                                    key: item.id,
                                    onClick: () => onNavigate(item.id),
                                    type: 'button',
                                },
                                [icon(item.icon), h('span', { key: 'label' }, item.label)]
                            )
                        ))
                    ),
                ]
            )
        );
    }

    function ProfileSection({ label, rows }) {
        return h(
            'section',
            { className: 'profile-section' },
            [
                h('h2', { key: 'label' }, label),
                h(
                    'div',
                    { className: 'profile-menu', key: 'menu' },
                    rows.map((row) => (
                        h(
                            row.toggle ? 'div' : 'button',
                            {
                                className: 'profile-row',
                                key: row.label,
                                onClick: row.toggle ? undefined : row.onClick,
                                type: row.toggle ? undefined : 'button',
                            },
                            [
                                h('span', { className: 'profile-row-icon', key: 'icon' }, icon(row.iconClass)),
                                h('strong', { key: 'label' }, row.label),
                                row.toggle
                                    ? h(ToggleSwitch, { checked: row.checked, key: 'toggle', label: row.label, onChange: row.onToggle })
                                    : icon('fa-solid fa-chevron-right'),
                            ]
                        )
                    ))
                ),
            ]
        );
    }

    function Modal({ children, onClose, title }) {
        return h(
            'div',
            { className: 'modal-backdrop', onMouseDown: (event) => event.target === event.currentTarget && onClose() },
            h(
                'section',
                { 'aria-modal': 'true', className: 'modal-card', role: 'dialog' },
                [
                    h('header', { className: 'modal-head', key: 'head' }, [
                        h('h2', { key: 'title' }, title),
                        h(IconButton, { iconClass: 'fa-solid fa-xmark', key: 'close', label: 'Close', onClick: onClose }),
                    ]),
                    h('div', { className: 'modal-body', key: 'body' }, children),
                ]
            )
        );
    }

    function ProductModal({ item, onClose, onSave }) {
        const [form, setForm] = useState(() => ({
            brand: item?.brand || '',
            category: item?.category || 'Flagship',
            condition: item?.condition || 'New',
            id: item?.id || '',
            model: item?.model || '',
            platform: item?.platform || 'ios',
            quantity: String(item?.quantity ?? ''),
            specs: item?.specs || '',
        }));

        function updateField(field, value) {
            setForm((current) => {
                const next = { ...current, [field]: value };

                if (field === 'model') {
                    const selectedProduct = PRODUCT_CATALOG.find((product) => product.model === value);

                    if (selectedProduct) {
                        next.brand = selectedProduct.brand;
                        next.category = selectedProduct.category;
                        next.condition = selectedProduct.condition;
                        next.image = selectedProduct.image;
                        next.platform = selectedProduct.platform;
                        next.specs = selectedProduct.specs;
                    }
                }

                return next;
            });
        }

        function submit(event) {
            event.preventDefault();
            onSave({
                ...form,
                id: form.id || String(Date.now()),
                quantity: safeQuantity(form.quantity),
            });
        }

        return h(
            Modal,
            { onClose, title: item ? 'Edit Product' : 'Add Product' },
            h(
                'form',
                { className: 'modal-form', onSubmit: submit },
                [
                    h(SelectField, { key: 'model', label: 'Model Name', onChange: (value) => updateField('model', value), options: PRODUCT_MODEL_OPTIONS, placeholder: 'Select a model', required: true, value: form.model }),
                    h(SelectField, { key: 'brand', label: 'Brand', onChange: (value) => updateField('brand', value), options: PRODUCT_BRAND_OPTIONS, placeholder: 'Select a brand', required: true, value: form.brand }),
                    h(SelectField, { key: 'specs', label: 'Specs', onChange: (value) => updateField('specs', value), options: PRODUCT_SPEC_OPTIONS, placeholder: 'Select specs', required: true, value: form.specs }),
                    h(FormField, { key: 'quantity', label: 'Quantity', min: 0, onChange: (value) => updateField('quantity', value), required: true, type: 'number', value: form.quantity }),
                    h('div', { className: 'form-grid', key: 'grid' }, [
                        h(SelectField, {
                            key: 'platform',
                            label: 'Platform',
                            onChange: (value) => updateField('platform', value),
                            options: [
                                { label: 'iOS', value: 'ios' },
                                { label: 'Android', value: 'android' },
                            ],
                            value: form.platform,
                        }),
                        h(SelectField, {
                            key: 'category',
                            label: 'Category',
                            onChange: (value) => updateField('category', value),
                            options: [
                                { label: 'Flagship', value: 'Flagship' },
                                { label: 'Mid Range', value: 'Mid Range' },
                                { label: 'Budget', value: 'Budget' },
                            ],
                            value: form.category,
                        }),
                    ]),
                    h(SelectField, {
                        key: 'condition',
                        label: 'Condition',
                        onChange: (value) => updateField('condition', value),
                        options: [
                            { label: 'New', value: 'New' },
                            { label: 'Pre-owned', value: 'Pre-owned' },
                            { label: 'Refurbished', value: 'Refurbished' },
                        ],
                        value: form.condition,
                    }),
                    h('div', { className: 'modal-actions', key: 'actions' }, [
                        h(Button, { key: 'cancel', onClick: onClose, variant: 'secondary' }, 'Cancel'),
                        h(Button, { iconClass: 'fa-solid fa-check', key: 'save', type: 'submit' }, item ? 'Save Changes' : 'Add Product'),
                    ]),
                ]
            )
        );
    }

    function CustomerTicketModal({ item, mode, onClose, onSubmit }) {
        const [form, setForm] = useState({
            customer: '',
            email: '',
            message: mode === 'Reservation'
                ? `I would like to reserve ${item?.model || 'this item'}.`
                : `I have a question about ${item?.model || 'this item'}.`,
            phone: '',
        });

        function updateField(field, value) {
            setForm({ ...form, [field]: value });
        }

        function submit(event) {
            event.preventDefault();
            onSubmit({
                ...form,
                product: item?.model || 'General Catalog',
                type: mode,
            });
        }

        return h(
            Modal,
            { onClose, title: mode === 'Reservation' ? 'Reserve Product' : 'Send Inquiry' },
            h(
                'form',
                { className: 'modal-form', onSubmit: submit },
                [
                    item ? h('div', { className: 'selected-product', key: 'selected' }, [
                        h('strong', { key: 'model' }, item.model),
                        h('small', { key: 'meta' }, `${item.brand} - ${item.specs}`),
                    ]) : null,
                    h(FormField, { key: 'customer', label: 'Customer Name', onChange: (value) => updateField('customer', value), required: true, value: form.customer }),
                    h(FormField, { key: 'email', label: 'Email', onChange: (value) => updateField('email', value), required: true, type: 'email', value: form.email }),
                    h(FormField, { key: 'phone', label: 'Phone Number', onChange: (value) => updateField('phone', value), required: true, type: 'tel', value: form.phone }),
                    h(TextAreaField, { key: 'message', label: 'Message', onChange: (value) => updateField('message', value), required: true, value: form.message }),
                    h('div', { className: 'modal-actions', key: 'actions' }, [
                        h(Button, { key: 'cancel', onClick: onClose, variant: 'secondary' }, 'Cancel'),
                        h(Button, { iconClass: 'fa-solid fa-paper-plane', key: 'submit', type: 'submit' }, mode === 'Reservation' ? 'Submit Reservation' : 'Send Inquiry'),
                    ]),
                ]
            )
        );
    }

    function TicketReplyModal({ onClose, onSave, ticket }) {
        const [reply, setReply] = useState(ticket.reply || '');

        function submit(event) {
            event.preventDefault();
            onSave(ticket.id, reply);
        }

        return h(
            Modal,
            { onClose, title: 'Reply to Ticket' },
            h(
                'form',
                { className: 'modal-form', onSubmit: submit },
                [
                    h('div', { className: 'selected-product', key: 'ticket' }, [
                        h('strong', { key: 'customer' }, ticket.customer),
                        h('small', { key: 'meta' }, `${ticket.type} - ${ticket.product}`),
                    ]),
                    h('blockquote', { className: 'reply-source', key: 'message' }, ticket.message),
                    h(TextAreaField, { key: 'reply', label: 'Admin Reply', onChange: setReply, required: true, value: reply }),
                    h('div', { className: 'modal-actions', key: 'actions' }, [
                        h(Button, { key: 'cancel', onClick: onClose, variant: 'secondary' }, 'Cancel'),
                        h(Button, { iconClass: 'fa-solid fa-reply', key: 'save', type: 'submit' }, 'Send Reply'),
                    ]),
                ]
            )
        );
    }

    function BranchMessageModal({ branch, onClose, onSubmit }) {
        const [message, setMessage] = useState(`Coordination message for ${branch.name}: `);

        function submit(event) {
            event.preventDefault();
            onSubmit(branch, message);
        }

        return h(
            Modal,
            { onClose, title: 'Branch Message' },
            h(
                'form',
                { className: 'modal-form', onSubmit: submit },
                [
                    h('div', { className: 'selected-product', key: 'branch' }, [
                        h('strong', { key: 'name' }, branch.name),
                        h('small', { key: 'meta' }, `${branch.location} - ${branch.manager}`),
                    ]),
                    h(TextAreaField, { key: 'message', label: 'Secure Message', onChange: setMessage, required: true, value: message }),
                    h('div', { className: 'modal-actions', key: 'actions' }, [
                        h(Button, { key: 'cancel', onClick: onClose, variant: 'secondary' }, 'Cancel'),
                        h(Button, { iconClass: 'fa-solid fa-paper-plane', key: 'send', type: 'submit' }, 'Send to Branch'),
                    ]),
                ]
            )
        );
    }

    function ProfileModal({ onClose, onSave, user }) {
        const [form, setForm] = useState({
            avatar: user.avatar || '',
            email: user.email || '',
            name: user.name || '',
            role: user.role || 'Admin',
            store: user.store || 'RF Chein Gadgets',
        });

        function updateField(field, value) {
            setForm({ ...form, [field]: value });
        }

        function submit(event) {
            event.preventDefault();
            onSave(form);
        }

        return h(
            Modal,
            { onClose, title: 'Edit Profile' },
            h(
                'form',
                { className: 'modal-form', onSubmit: submit },
                [
                    h(FormField, { key: 'name', label: 'Admin Name', onChange: (value) => updateField('name', value), required: true, value: form.name }),
                    h(FormField, { key: 'email', label: 'Email', onChange: (value) => updateField('email', value), required: true, type: 'email', value: form.email }),
                    h(FormField, { key: 'role', label: 'Role', onChange: (value) => updateField('role', value), required: true, value: form.role }),
                    h(FormField, { key: 'store', label: 'Store', onChange: (value) => updateField('store', value), required: true, value: form.store }),
                    h(FormField, { key: 'avatar', label: 'Avatar URL', onChange: (value) => updateField('avatar', value), type: 'url', value: form.avatar }),
                    h('div', { className: 'modal-actions', key: 'actions' }, [
                        h(Button, { key: 'cancel', onClick: onClose, variant: 'secondary' }, 'Cancel'),
                        h(Button, { iconClass: 'fa-solid fa-check', key: 'save', type: 'submit' }, 'Save Profile'),
                    ]),
                ]
            )
        );
    }

    function ConfirmDeleteModal({ item, onClose, onConfirm }) {
        return h(
            Modal,
            { onClose, title: 'Delete Product' },
            h('div', { className: 'confirm-box' }, [
                h('span', { className: 'confirm-icon', key: 'icon' }, icon('fa-regular fa-trash-can')),
                h('p', { key: 'text' }, `Delete ${item.model}? This action cannot be undone.`),
                h('div', { className: 'modal-actions', key: 'actions' }, [
                    h(Button, { key: 'cancel', onClick: onClose, variant: 'secondary' }, 'Cancel'),
                    h(Button, { iconClass: 'fa-solid fa-trash', key: 'delete', onClick: onConfirm, variant: 'danger' }, 'Delete'),
                ]),
            ])
        );
    }

    function InfoModal({ body, onClose, title }) {
        return h(
            Modal,
            { onClose, title },
            h('div', { className: 'info-box' }, [
                h('span', { className: 'info-icon', key: 'icon' }, icon('fa-regular fa-circle-check')),
                h('p', { key: 'body' }, body),
                h(Button, { key: 'done', onClick: onClose }, 'Done'),
            ])
        );
    }

    function FormField({ label, min, onChange, required, type, value }) {
        return h(
            'label',
            { className: 'field modal-field' },
            [
                h('span', { key: 'label' }, label),
                h('input', {
                    key: 'input',
                    min,
                    onChange: (event) => onChange(event.target.value),
                    required,
                    type: type || 'text',
                    value,
                }),
            ]
        );
    }

    function TextAreaField({ label, onChange, required, value }) {
        return h(
            'label',
            { className: 'field modal-field' },
            [
                h('span', { key: 'label' }, label),
                h('textarea', {
                    key: 'textarea',
                    onChange: (event) => onChange(event.target.value),
                    required,
                    rows: 5,
                    value,
                }),
            ]
        );
    }

    function SelectField({ label, onChange, options, placeholder, required, value }) {
        return h(
            'label',
            { className: 'field modal-field' },
            [
                h('span', { key: 'label' }, label),
                h(
                    'select',
                    { key: 'select', onChange: (event) => onChange(event.target.value), required, value },
                    [
                        placeholder ? h('option', { key: 'placeholder', value: '' }, placeholder) : null,
                        ...options.map((option) => h('option', { key: option.value, value: option.value }, option.label)),
                    ]
                ),
            ]
        );
    }

    function Toast({ message }) {
        return h('div', { className: cx('toast', message && 'show'), role: 'status' }, message);
    }

    function App() {
        const [status, setStatus] = useState('');
        const [toast, setToast] = useState('');
        const [modal, setModal] = useState(null);
        const [guestMode, setGuestMode] = useState(false);
        const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE.theme) || DEFAULT_USER.theme);
        const [notifications, setNotifications] = useState(() => readJson(STORAGE.notifications, true));
        const [branches, setBranches] = useState(() => readArray(STORAGE.branches, DEFAULT_BRANCHES));
        const [inventory, setInventory] = useState(() => readArray(STORAGE.inventory, DEFAULT_INVENTORY));
        const [flashSaleConfig, setFlashSaleConfig] = useState(() => ({ ...DEFAULT_FLASH_SALE_CONFIG, ...readJson(STORAGE.flashSaleConfig, {}) }));
        const [stockTrend, setStockTrend] = useState(() => {
            const savedTrend = readJson(STORAGE.stockTrend, null);

            if (Array.isArray(savedTrend) && savedTrend.length) {
                return savedTrend;
            }

            const initialInventory = readArray(STORAGE.inventory, DEFAULT_INVENTORY);
            const initialTotal = initialInventory.reduce((sum, item) => sum + safeQuantity(item.quantity), 0);

            return CHARTS.stock.map((point, index) => (
                index === CHARTS.stock.length - 1
                    ? { ...point, value: initialTotal }
                    : point
            ));
        });
        const [tickets, setTickets] = useState(() => readArray(STORAGE.tickets, DEFAULT_TICKETS));
        const [activeView, setActiveView] = useState(() => localStorage.getItem(STORAGE.activeView) || 'profile');
        const [user, setUser] = useState(() => {
            const signedOut = localStorage.getItem(STORAGE.signedOut) === 'true';
            const savedSession = readJson(STORAGE.session, null);
            return savedSession || (signedOut ? null : DEFAULT_USER);
        });

        const stats = useMemo(() => summarizeInventory(inventory), [inventory]);
        const inventoryTotalUnits = useMemo(() => inventory.reduce((sum, item) => sum + safeQuantity(item.quantity), 0), [inventory]);

        useEffect(() => {
            document.body.dataset.theme = theme === 'light' ? 'light' : 'dark';
            localStorage.setItem(STORAGE.theme, theme);

            if (user) {
                const updatedUser = { ...user, theme };
                writeJson(STORAGE.session, updatedUser);
                apiRequest('/api/settings', { method: 'PATCH', body: JSON.stringify({ theme }) });
            }
        }, [theme]);

        useEffect(() => {
            writeJson(STORAGE.inventory, inventory);
        }, [inventory]);

        useEffect(() => {
            setStockTrend((currentTrend) => {
                const nextPoint = { label: stockTrendLabel(), value: inventoryTotalUnits };

                if (!currentTrend.length) {
                    return [nextPoint];
                }

                const lastPoint = currentTrend[currentTrend.length - 1];

                if (lastPoint.label === nextPoint.label) {
                    return [...currentTrend.slice(0, -1), nextPoint];
                }

                if (lastPoint.value === nextPoint.value) {
                    return currentTrend;
                }

                return [...currentTrend, nextPoint].slice(-12);
            });
        }, [inventoryTotalUnits]);

        useEffect(() => {
            writeJson(STORAGE.stockTrend, stockTrend);
        }, [stockTrend]);

        useEffect(() => {
            writeJson(STORAGE.tickets, tickets);
        }, [tickets]);

        useEffect(() => {
            writeJson(STORAGE.branches, branches);
        }, [branches]);

        useEffect(() => {
            writeJson(STORAGE.notifications, notifications);
        }, [notifications]);

        useEffect(() => {
            writeJson(STORAGE.flashSaleConfig, flashSaleConfig);
        }, [flashSaleConfig]);

        useEffect(() => {
            localStorage.setItem(STORAGE.activeView, activeView);
        }, [activeView]);

        useEffect(() => {
            if (!toast) {
                return undefined;
            }

            const timer = window.setTimeout(() => setToast(''), 2400);
            return () => window.clearTimeout(timer);
        }, [toast]);

        function showToast(message) {
            setToast(message);
        }

        function persistUser(nextUser) {
            const normalizedUser = { ...DEFAULT_USER, ...nextUser, theme };
            setUser(normalizedUser);
            writeJson(STORAGE.session, normalizedUser);
            localStorage.removeItem(STORAGE.signedOut);
        }

        function handleLogin(credentials) {
            const storedUsers = readArray(STORAGE.users, []);
            const users = [DEFAULT_USER, ...storedUsers.filter((item) => item?.email?.toLowerCase() !== DEFAULT_USER.email.toLowerCase())];
            const found = users.find((item) => item.email.toLowerCase() === credentials.email.toLowerCase() && item.pass === credentials.pass);

            if (!found) {
                setStatus('Invalid email or password.');
                return;
            }

            persistUser(found);
            setGuestMode(false);
            setStatus('');
            setActiveView('profile');
            apiRequest('/api/login', { method: 'POST', body: JSON.stringify(credentials) });
        }

        function handleSignup(payload) {
            const newUser = {
                avatar: DEFAULT_USER.avatar,
                email: payload.email.trim(),
                name: payload.name.trim(),
                pass: payload.pass,
                role: 'Admin',
                store: 'RF Chein Gadgets',
                theme,
            };
            const storedUsers = readArray(STORAGE.users, []);
            const users = [DEFAULT_USER, ...storedUsers].filter((item) => item?.email?.toLowerCase() !== newUser.email.toLowerCase());
            const nextUsers = [...users, newUser];
            writeJson(STORAGE.users, nextUsers);
            persistUser(newUser);
            setGuestMode(false);
            setStatus('');
            setActiveView('profile');
            apiRequest('/api/signup', { method: 'POST', body: JSON.stringify(newUser) });
        }

        function handleNavigate(view) {
            setActiveView(view);
        }

        function handleSaveFlashSaleConfig(nextConfig) {
            setFlashSaleConfig({
                brand: nextConfig.brand,
                stockLimit: safeQuantity(nextConfig.stockLimit),
                timerHours: safeQuantity(nextConfig.timerHours),
            });
            setModal(null);
            showToast('Flash sale updated.');
        }

        function handleSaveProduct(product) {
            const exists = inventory.some((item) => item.id === product.id);
            const nextInventory = exists
                ? inventory.map((item) => (item.id === product.id ? product : item))
                : [product, ...inventory];

            setInventory(nextInventory);
            setModal(null);
            showToast(exists ? 'Product updated.' : 'Product added.');

            const method = exists ? 'PATCH' : 'POST';
            const path = exists ? `/api/inventory/${product.id}` : '/api/inventory';
            apiRequest(path, { method, body: JSON.stringify(product) });
        }

        function handleDeleteProduct(item) {
            setInventory(inventory.filter((product) => product.id !== item.id));
            setModal(null);
            showToast('Product deleted.');
            apiRequest(`/api/inventory/${item.id}`, { method: 'DELETE' });
        }

        function handleCreateTicket(payload) {
            const nextTicket = {
                id: `ticket-${Date.now()}`,
                createdAt: timestampLabel(),
                priority: payload.type === 'Reservation' ? 'High' : 'Medium',
                reply: '',
                status: payload.type === 'Reservation' ? 'Pending' : 'Open',
                ...payload,
            };

            setTickets((currentTickets) => [nextTicket, ...currentTickets]);
            setModal(null);
            showToast(payload.type === 'Reservation' ? 'Reservation request sent.' : 'Inquiry sent to admin.');
            setActiveView('tickets');
        }

        function handleReplyTicket(ticketId, reply) {
            setTickets((currentTickets) => currentTickets.map((ticket) => (
                ticket.id === ticketId
                    ? { ...ticket, reply, status: 'Open' }
                    : ticket
            )));
            setModal(null);
            showToast('Admin reply saved.');
        }

        function handleTicketStatus(ticketId, status) {
            setTickets((currentTickets) => currentTickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, status } : ticket)));
            showToast(status === 'Closed' ? 'Ticket closed.' : 'Ticket reopened.');
        }

        function handleBranchSync(branchId) {
            setBranches((currentBranches) => currentBranches.map((branch) => (
                branch.id === branchId
                    ? { ...branch, status: 'Online', lastSync: 'Just now' }
                    : branch
            )));
            showToast('Branch data synchronized.');
        }

        function handleBranchMessage(branch, message) {
            const nextTicket = {
                id: `ticket-${Date.now()}`,
                createdAt: timestampLabel(),
                customer: branch.name,
                email: `${branch.id}@rfchein.local`,
                message,
                phone: 'Internal channel',
                priority: branch.status === 'Offline' ? 'High' : 'Medium',
                product: branch.channel,
                reply: '',
                status: 'Open',
                type: 'Branch',
            };

            setTickets((currentTickets) => [nextTicket, ...currentTickets]);
            setBranches((currentBranches) => currentBranches.map((item) => (
                item.id === branch.id
                    ? { ...item, tickets: safeQuantity(item.tickets) + 1 }
                    : item
            )));
            setModal(null);
            showToast('Branch message routed to tickets.');
            setActiveView('tickets');
        }

        function handleSaveProfile(nextProfile) {
            const nextUser = { ...user, ...nextProfile };
            persistUser(nextUser);
            setModal(null);
            showToast('Profile updated.');
            apiRequest('/api/session', { method: 'PATCH', body: JSON.stringify(nextProfile) });
        }

        function handleNotificationsChange(checked) {
            setNotifications(checked);
            showToast(checked ? 'Notifications enabled.' : 'Notifications muted.');
        }

        function handleThemeChange(nextTheme) {
            setTheme(nextTheme);
            showToast(nextTheme === 'dark' ? 'Dark mode enabled.' : 'Light mode enabled.');
        }

        function handleSignOut() {
            setUser(null);
            setGuestMode(false);
            localStorage.removeItem(STORAGE.session);
            localStorage.setItem(STORAGE.signedOut, 'true');
            setActiveView('home');
            showToast('Signed out.');
            apiRequest('/api/logout', { method: 'POST' });
        }

        if (!user && guestMode) {
            return h(React.Fragment, null, [
                h(PublicPortalShell, {
                    inventory,
                    key: 'public',
                    onAdminSignIn: () => {
                        setGuestMode(false);
                        setStatus('Sign in to manage admin replies.');
                    },
                    onInquiry: (item) => setModal({ type: 'customer-ticket', item, mode: 'Inquiry' }),
                    onReserve: (item) => setModal({ type: 'customer-ticket', item, mode: 'Reservation' }),
                }),
                modal?.type === 'customer-ticket'
                    ? h(CustomerTicketModal, { item: modal.item, key: 'customer-ticket-modal', mode: modal.mode, onClose: () => setModal(null), onSubmit: handleCreateTicket })
                    : null,
                h(Toast, { key: 'toast', message: toast }),
            ]);
        }

        if (!user) {
            return h(React.Fragment, null, [
                h(AuthScreen, {
                    key: 'auth',
                    onLogin: handleLogin,
                    onOpenPortal: () => {
                        setGuestMode(true);
                        setStatus('');
                    },
                    onSignup: handleSignup,
                    setStatus,
                    status,
                }),
                h(Toast, { key: 'toast', message: toast }),
            ]);
        }

        const pageProps = {
            inventory,
            onAddProduct: () => setModal({ type: 'product' }),
            onDeleteProduct: (item) => setModal({ type: 'delete', item }),
            onEditProduct: (item) => setModal({ type: 'product', item }),
            onNavigate: handleNavigate,
            flashSaleConfig,
            onUpdateFlashSaleConfig: handleSaveFlashSaleConfig,
            stockTrend,
        };

        const pages = {
            analytics: h(AnalyticsPage, { inventory }),
            branches: h(BranchNetworkPage, {
                branches,
                onBranchMessage: (branch) => setModal({ type: 'branch-message', branch }),
                onBranchSync: handleBranchSync,
            }),
            customers: h(CustomersPage),
            home: h(HomePage, pageProps),
            inventory: h(InventoryPage, pageProps),
            portal: h(CustomerPortalPage, {
                inventory,
                onInquiry: (item) => setModal({ type: 'customer-ticket', item, mode: 'Inquiry' }),
                onNavigate: handleNavigate,
                onReserve: (item) => setModal({ type: 'customer-ticket', item, mode: 'Reservation' }),
            }),
            profile: h(ProfilePage, {
                activeView,
                notifications,
                onEditProfile: () => setModal({ type: 'profile' }),
                onInfo: (title, body) => setModal({ type: 'info', title, body }),
                onNavigate: handleNavigate,
                onNotificationsChange: handleNotificationsChange,
                onSignOut: handleSignOut,
                onThemeChange: handleThemeChange,
                stats,
                theme,
                user,
            }),
            tickets: h(TicketCenterPage, {
                onReply: (ticket) => setModal({ type: 'ticket-reply', ticket }),
                onStatusChange: handleTicketStatus,
                tickets,
            }),
            units: h(UnitsPage),
        };

        return h(
            React.Fragment,
            null,
            [
                h(
                    'div',
                    { className: cx('app-shell', activeView === 'profile' && 'profile-active'), key: 'app' },
                    [
                        h(Sidebar, { activeView, key: 'sidebar', onNavigate: handleNavigate, user }),
                        h('div', { className: 'main-panel', key: 'main' }, [
                            h(TopBar, {
                                activeView,
                                key: 'top',
                                notifications,
                                onNavigate: handleNavigate,
                                onNotify: () => showToast(notifications ? 'Notifications are enabled.' : 'Notifications are muted.'),
                                user,
                            }),
                            h('main', { className: 'content-area', key: 'content' }, pages[activeView] || pages.home),
                        ]),
                        activeView === 'profile' ? null : h(BottomNav, { activeView, key: 'bottom', onNavigate: handleNavigate }),
                    ]
                ),
                modal?.type === 'product'
                    ? h(ProductModal, { item: modal.item, key: 'product-modal', onClose: () => setModal(null), onSave: handleSaveProduct })
                    : null,
                modal?.type === 'customer-ticket'
                    ? h(CustomerTicketModal, { item: modal.item, key: 'customer-ticket-modal', mode: modal.mode, onClose: () => setModal(null), onSubmit: handleCreateTicket })
                    : null,
                modal?.type === 'ticket-reply'
                    ? h(TicketReplyModal, { key: 'ticket-reply-modal', onClose: () => setModal(null), onSave: handleReplyTicket, ticket: modal.ticket })
                    : null,
                modal?.type === 'branch-message'
                    ? h(BranchMessageModal, { branch: modal.branch, key: 'branch-message-modal', onClose: () => setModal(null), onSubmit: handleBranchMessage })
                    : null,
                modal?.type === 'profile'
                    ? h(ProfileModal, { key: 'profile-modal', onClose: () => setModal(null), onSave: handleSaveProfile, user })
                    : null,
                modal?.type === 'delete'
                    ? h(ConfirmDeleteModal, { item: modal.item, key: 'delete-modal', onClose: () => setModal(null), onConfirm: () => handleDeleteProduct(modal.item) })
                    : null,
                modal?.type === 'info'
                    ? h(InfoModal, { body: modal.body, key: 'info-modal', onClose: () => setModal(null), title: modal.title })
                    : null,
                h(Toast, { key: 'toast', message: toast }),
            ]
        );
    }

    ReactDOM.createRoot(root).render(h(App));
})();
