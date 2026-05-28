/* ==========================================================================
   UNIFYTE BILL ERP - CLIENT INTERACTIVITY ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. NAVIGATION SCROLL & MOBILE BURGER MENU
    // ==========================================
    const header = document.getElementById('main-header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navigationMenu = document.getElementById('navigation-menu');
    const navItems = document.querySelectorAll('.nav-item');

    // Sticky navbar header shrink on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Simple scrollspy indicator
        const scrollPosition = window.scrollY + 120;
        document.querySelectorAll('section').forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPosition >= top && scrollPosition < top + height) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    });

    // Mobile Hamburger Menu sliding
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navigationMenu.classList.toggle('active');
    });

    // Close mobile menu on clicking any navigation link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navigationMenu.classList.remove('active');
        });
    });


    // ==========================================
    // 2. HERO INTERACTIVE DASHBOARD CONTROLLER
    // ==========================================
    
    // Multi-tenant analytical dataset representing timeframes
    const dashboardData = {
        today: {
            timeText: "Today",
            avgInvoice: "₹8,400.00",
            collectionRate: "95.0%",
            collectionClass: "text-green",
            totalCustomers: "1",
            revenue: "₹8,400.00",
            growth: "+5.4%",
            profit: "₹4,100.00",
            margin: "48.8% Margin",
            invoiceCount: "1",
            dueCount: "0 Unpaid",
            dueRevenue: "₹0.00",
            dueClass: "badge-growth",
            salesPoints: {
                line: "M 40 155 L 150 155 L 260 155 L 370 155 L 460 70",
                area: "M 40 155 L 150 155 L 260 155 L 370 155 L 460 70 L 460 155 Z"
            },
            donutGrad: "conic-gradient(#10b981 0% 95%, #f59e0b 95% 100%)",
            donutPct: "95.0%"
        },
        week: {
            timeText: "This Week",
            avgInvoice: "₹12,120.00",
            collectionRate: "88.2%",
            collectionClass: "text-green",
            totalCustomers: "2",
            revenue: "₹24,240.00",
            growth: "+8.9%",
            profit: "₹11,800.00",
            margin: "48.6% Margin",
            invoiceCount: "2",
            dueCount: "1 Unpaid",
            dueRevenue: "₹4,500.00",
            dueClass: "badge-unpaid",
            salesPoints: {
                line: "M 40 155 Q 120 110 260 140 T 460 50",
                area: "M 40 155 Q 120 110 260 140 T 460 50 L 460 155 Z"
            },
            donutGrad: "conic-gradient(#10b981 0% 88.2%, #f59e0b 88.2% 100%)",
            donutPct: "88.2%"
        },
        month: {
            timeText: "This Month",
            avgInvoice: "₹16,151.25",
            collectionRate: "80.6%",
            collectionClass: "text-green",
            totalCustomers: "2",
            revenue: "₹64,605.00",
            growth: "+12.5%",
            profit: "₹32,200.00",
            margin: "49.8% Margin",
            invoiceCount: "4",
            dueCount: "2 Unpaid",
            dueRevenue: "₹44,840.00",
            dueClass: "badge-unpaid",
            salesPoints: {
                line: "M 40 155 Q 120 130 180 145 T 320 85 T 460 120",
                area: "M 40 155 Q 120 130 180 145 T 320 85 T 460 120 L 460 155 Z"
            },
            donutGrad: "conic-gradient(#10b981 0% 80.6%, #f59e0b 80.6% 100%)",
            donutPct: "80.6%"
        },
        all: {
            timeText: "All Time",
            avgInvoice: "₹21,800.00",
            collectionRate: "92.4%",
            collectionClass: "text-green",
            totalCustomers: "12",
            revenue: "₹261,600.00",
            growth: "+24.8%",
            profit: "₹130,800.00",
            margin: "50.0% Margin",
            invoiceCount: "12",
            dueCount: "1 Unpaid",
            dueRevenue: "₹18,900.00",
            dueClass: "badge-unpaid",
            salesPoints: {
                line: "M 40 140 C 120 90 200 60 300 75 S 400 40 460 20",
                area: "M 40 140 C 120 90 200 60 300 75 S 400 40 460 20 L 460 155 Z"
            },
            donutGrad: "conic-gradient(#10b981 0% 92.4%, #f59e0b 92.4% 100%)",
            donutPct: "92.4%"
        }
    };

    const timeButtons = document.querySelectorAll('.db-time-btn');
    const activeTimeLabel = document.getElementById('active-time-text');
    const statAvg = document.getElementById('stat-avg');
    const statCollection = document.getElementById('stat-collection');
    const statCustomers = document.getElementById('stat-customers');
    const metricRev = document.getElementById('metric-revenue');
    const metricGrowth = document.getElementById('metric-growth');
    const metricProfit = document.getElementById('metric-profit');
    const metricMargin = document.getElementById('metric-margin-pct');
    const metricCount = document.getElementById('metric-count');
    const metricDueCount = document.getElementById('metric-due-count');
    const metricDue = document.getElementById('metric-due');
    const trendLine = document.getElementById('trend-line-path');
    const trendArea = document.getElementById('trend-area-path');
    const donutChart = document.getElementById('payment-donut');
    const donutCenterText = document.getElementById('donut-center-pct');

    // Time Frame Toggler Handler
    timeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active states
            timeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const period = btn.getAttribute('data-time');
            const data = dashboardData[period];

            // Trigger beautiful DOM cross-fades
            fadeUpdate(activeTimeLabel, data.timeText);
            fadeUpdate(statAvg, data.avgInvoice);
            
            // Collection Rate formatting
            statCollection.className = `qs-value ${data.collectionClass}`;
            fadeUpdate(statCollection, data.collectionRate);
            
            fadeUpdate(statCustomers, data.totalCustomers);
            fadeUpdate(metricRev, data.revenue);
            
            // Revenue growth badge
            metricGrowth.textContent = data.growth;
            
            fadeUpdate(metricProfit, data.profit);
            fadeUpdate(metricMargin, data.margin);
            fadeUpdate(metricCount, data.invoiceCount);

            // Pending dues styling
            metricDueCount.className = `card-label ${data.dueClass === 'badge-growth' ? 'text-green' : ''}`;
            metricDueCount.innerHTML = `PENDING DUES <span class="${data.dueClass}">${data.dueCount}</span>`;
            
            fadeUpdate(metricDue, data.dueRevenue);
            
            // Animate SVG Line Graph Points
            trendLine.setAttribute('d', data.salesPoints.line);
            trendArea.setAttribute('d', data.salesPoints.area);

            // Reposition individual data node circles
            const circles = document.querySelectorAll('.chart-point');
            if (circles.length === 5) {
                if (period === 'today') {
                    setCircle(circles[0], 40, 155);
                    setCircle(circles[1], 150, 155);
                    setCircle(circles[2], 260, 155);
                    setCircle(circles[3], 370, 155);
                    setCircle(circles[4], 460, 70);
                } else if (period === 'week') {
                    setCircle(circles[0], 40, 155);
                    setCircle(circles[1], 150, 132);
                    setCircle(circles[2], 260, 140);
                    setCircle(circles[3], 370, 105);
                    setCircle(circles[4], 460, 50);
                } else if (period === 'month') {
                    setCircle(circles[0], 40, 155);
                    setCircle(circles[1], 150, 138);
                    setCircle(circles[2], 260, 115);
                    setCircle(circles[3], 370, 72);
                    setCircle(circles[4], 460, 120);
                } else if (period === 'all') {
                    setCircle(circles[0], 40, 140);
                    setCircle(circles[1], 150, 108);
                    setCircle(circles[2], 260, 85);
                    setCircle(circles[3], 370, 68);
                    setCircle(circles[4], 460, 20);
                }
            }

            // Animate Donut status circle conic gradient
            donutChart.style.background = data.donutGrad;
            donutCenterText.textContent = data.donutPct;
        });
    });

    // Sub-routine: Helper to set circle coordinates in SVG
    function setCircle(node, cx, cy) {
        node.setAttribute('cx', cx);
        node.setAttribute('cy', cy);
    }

    // Sub-routine: Helper to fade element value out and in
    function fadeUpdate(element, newValue) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(-2px)';
        setTimeout(() => {
            element.textContent = newValue;
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 150);
    }


    // ==========================================
    // 3. CLOSED-LOOP BILL & STOCK SIMULATOR
    // ==========================================
    
    // Catalog definitions including custom stock pools and base production margins
    const products = {
        "Premium Headphones": { price: 4500, cost: 2500, gstCode: "0.18", gstDesc: "18% GST (Included)" },
        "Ergonomic Desk Chair": { price: 8900, cost: 5200, gstCode: "0.18", gstDesc: "18% GST (Included)" },
        "Smart LED Desk Lamp": { price: 1200, cost: 650, gstCode: "0.12", gstDesc: "12% GST (Included)" },
        "Mechanical Keyboard": { price: 4500, cost: 2600, gstCode: "0.18", gstDesc: "18% GST (Included)" }
    };

    let activeStock = 8;
    const maxStock = 10;

    const prodSelect = document.getElementById('sim-item-name');
    const qtyInput = document.getElementById('sim-item-qty');
    const priceInput = document.getElementById('sim-item-price');
    const taxSelect = document.getElementById('sim-item-tax');
    const customerInput = document.getElementById('sim-customer');
    const btnGenerate = document.getElementById('btn-generate-invoice');
    const btnReset = document.getElementById('btn-reset-simulator');

    const stockBadge = document.getElementById('sim-stock-badge');
    const stockFill = document.getElementById('sim-stock-fill');
    const stockWarning = document.getElementById('sim-stock-warning');

    // Bill receipt panel text nodes
    const receiptCard = document.getElementById('generated-receipt');
    const recId = document.getElementById('rec-id');
    const recDate = document.getElementById('rec-date');
    const recClient = document.getElementById('rec-client');
    const recItemName = document.getElementById('rec-item-name');
    const recTaxLbl = document.getElementById('rec-tax-lbl');
    const recItemQty = document.getElementById('rec-item-qty');
    const recItemUnit = document.getElementById('rec-item-unit');
    const recItemSubtotal = document.getElementById('rec-item-subtotal');
    const recCalcSub = document.getElementById('rec-calc-sub');
    const recCalcTaxLbl = document.getElementById('rec-calc-tax-lbl');
    const recCalcTax = document.getElementById('rec-calc-tax');
    const recCalcTotal = document.getElementById('rec-calc-total');

    // Auto-update price field depending on catalog selection
    prodSelect.addEventListener('change', () => {
        const item = products[prodSelect.value];
        if (item) {
            priceInput.value = item.price;
            taxSelect.value = item.gstCode;
        }
    });

    // Generator handler click event
    btnGenerate.addEventListener('click', () => {
        const qty = parseInt(qtyInput.value);
        const price = parseFloat(priceInput.value);
        const taxRate = parseFloat(taxSelect.value);
        const selectedProdName = prodSelect.value;
        const customer = customerInput.value || "Supreme Distributors Ltd.";

        // Out-of-Stock critical validation check
        if (activeStock <= 0) {
            alert("🚨 Error: Out of stock! Please click 'Reset Stock' to replenish inventory.");
            return;
        }

        if (qty > activeStock) {
            alert(`🚨 Error: Cannot bill ${qty} units. Only ${activeStock} remaining in stock!`);
            return;
        }

        // Deduct inventory stock levels
        activeStock -= qty;
        updateStockUI();

        // Generate dynamic invoice numbers
        const randId = Math.floor(1000 + Math.random() * 9000);
        recId.textContent = `INV-2026-${randId}`;

        // Get current date formatted
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        recDate.textContent = new Date().toLocaleDateString('en-US', options);

        // Perform financial calculations
        const lineTotal = price * qty;
        const subtotal = lineTotal / (1 + taxRate);
        const taxAmount = lineTotal - subtotal;

        // Apply drop-in updates onto the receipt card structure
        receiptCard.style.transform = 'scale(0.98)';
        receiptCard.style.opacity = '0.7';

        setTimeout(() => {
            recClient.innerHTML = `${customer} <br> Status: <span class="badge-receipt-unpaid" id="rec-status-badge">UNPAID</span>`;
            recItemName.textContent = selectedProdName;
            recTaxLbl.textContent = `${taxRate * 100}% GST (Included)`;
            recItemQty.textContent = qty;
            recItemUnit.textContent = `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
            recItemSubtotal.textContent = `₹${lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
            recCalcSub.textContent = `₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
            recCalcTaxLbl.textContent = `Tax Amount (GST ${taxRate * 100}%):`;
            recCalcTax.textContent = `₹${taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
            recCalcTotal.textContent = `₹${lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

            receiptCard.style.transform = 'scale(1)';
            receiptCard.style.opacity = '1';

            // DYNAMIC UPI SETTLEMENT SIMULATOR (WOW Factor!)
            // Simulate that in 3 seconds, the remote client scans the QR code and the payment reconciles live!
            setTimeout(() => {
                const statusBadge = document.getElementById('rec-status-badge');
                if (statusBadge) {
                    statusBadge.className = 'badge-receipt-paid';
                    statusBadge.innerHTML = '✓ PAID via UPI';
                    
                    // Show small subtle notification banner on header or page
                    const payNotification = document.createElement('div');
                    payNotification.style.cssText = `
                        position: fixed;
                        bottom: 24px;
                        right: 24px;
                        background: rgba(16, 185, 129, 0.95);
                        color: #ffffff;
                        padding: 16px 24px;
                        border-radius: 12px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                        z-index: 10000;
                        font-family: var(--font-body);
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        border: 1px solid rgba(255,255,255,0.1);
                        backdrop-filter: blur(10px);
                        transform: translateY(100px);
                        transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    `;
                    payNotification.innerHTML = `<span>💰 UPI Webhook Settlement Success! Invoiced payment of <strong>₹${lineTotal.toLocaleString('en-IN')}</strong> reconciled instantly.</span>`;
                    document.body.appendChild(payNotification);
                    
                    // Slide in
                    setTimeout(() => {
                        payNotification.style.transform = 'translateY(0)';
                    }, 50);

                    // Fade and slide out
                    setTimeout(() => {
                        payNotification.style.opacity = '0';
                        payNotification.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            payNotification.remove();
                        }, 500);
                    }, 4000);
                }
            }, 3000);

        }, 3000);

    });

    // Reset stock to maximum count
    btnReset.addEventListener('click', () => {
        activeStock = maxStock;
        qtyInput.value = 1;
        updateStockUI();
    });

    // Adjust fill bars and status flags based on calculations
    function updateStockUI() {
        const pct = (activeStock / maxStock) * 100;
        stockFill.style.width = `${pct}%`;
        
        // Color transition
        if (activeStock <= 3) {
            stockFill.className = 'stock-bar-fill critical';
            stockBadge.className = 'stock-badge low-stock';
            stockBadge.textContent = `${activeStock} items (Low!)`;
            stockWarning.style.display = 'flex';
        } else {
            stockFill.className = 'stock-bar-fill';
            stockBadge.className = 'stock-badge in-stock';
            stockBadge.textContent = `${activeStock} in stock`;
            stockWarning.style.display = 'none';
        }
        
        if (activeStock === 0) {
            stockBadge.textContent = "OUT OF STOCK";
        }
    }

    // Run once at start
    updateStockUI();


    // ==========================================
    // 4. AI BUSINESS COACH INTERACTIVE CHATBOX
    // ==========================================
    
    // Analytical forecast scripts matching pill selectors
    const aiInsightAnswers = {
        cashflow: "🔮 <strong>Forecast Cash Flow Outlook (Next Month)</strong><br><br>" +
                  "I've compiled seasonal invoices and run a regression trend on your cash pipelines. " +
                  "Your cash balance is projected to grow to <strong>₹89,450.00</strong> next month (a <strong>+14.3% increase</strong>).<br><br>" +
                  "💡 <em>Action Plan:</em> Your collection pipeline is healthy. We recommend allocating <strong>₹18,000.00</strong> of " +
                  "surplus capital towards advanced pre-orders of high-margin retail products before Q3 supply chains tighten.",
        
        latepayers: "💸 <strong>Invoice Settlement Delay Warning (Risk Assessment)</strong><br><br>" +
                    "I analyzed payment histories for the past 60 days. Account reference <strong>'Supreme Distributors Ltd.'</strong> " +
                    "currently has 2 outstanding invoices and averages <strong>12.4 days overdue</strong> beyond Net-30.<br><br>" +
                    "💡 <em>Action Plan:</em> Unifyte has flagged this reference. I scheduled a soft payment link notification " +
                    "to deliver automatically via email/WhatsApp <strong>3 days prior</strong> to invoice term limits.",
        
        reorder: "📦 <strong>Closed-Loop Inventory Run-Out Forecast</strong><br><br>" +
                 "Based on average billing cycles (2.8 units per week), your active store pool for " +
                 "<strong>'Premium Headphones' (current: 8 items)</strong> will run dry in exactly <strong>20 days</strong>.<br><br>" +
                 "💡 <em>Action Plan:</em> I recommend setting a purchase order of <strong>15 units</strong> before stock level hit " +
                 "the critical low threshold of <strong>3 units</strong>. Doing so prevents stockouts and maintains margin streams.",
        
        margin: "📊 <strong>Multi-Tenant Database Margin Analysis</strong><br><br>" +
                "Your aggregated gross profit margin for this month is running at a premium <strong>49.8%</strong>, " +
                "significantly above the retail sector average (35%).<br><br>" +
                "&bull; <em>High-margin stream:</em> Wholesaling (Margin: 42.1%)<br>" +
                "&bull; <em>Premium-margin stream:</em> Retail direct (Margin: 56.4%)<br><br>" +
                "💡 <em>Action Plan:</em> Standard GST overhead is successfully hedged via inbound stock credits. Capital allocation is highly optimized."
    };

    const presetButtons = document.querySelectorAll('.query-pill');
    const chatScroller = document.getElementById('chat-scroller');
    const chatPresetsContainer = document.getElementById('chat-presets');
    const typingIndicator = document.getElementById('chat-typing');

    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const queryKey = btn.getAttribute('data-query');
            const userPromptText = btn.textContent;
            const insightAnswer = aiInsightAnswers[queryKey];

            if (!insightAnswer) return;

            // 1. Inject User Query bubble
            appendMessage(userPromptText, 'user-msg');

            // 2. Hide suggestions drawer temporarily
            chatPresetsContainer.style.display = 'none';

            // 3. Trigger bouncing typing state indicator
            typingIndicator.style.display = 'flex';
            scrollToBottom();

            // 4. Simulate neural network analysis latency
            setTimeout(() => {
                // Remove typing bubble
                typingIndicator.style.display = 'none';

                // Inject structured insight response
                appendMessage(insightAnswer, 'bot-msg');

                // Restore query suggest list
                chatPresetsContainer.style.display = 'flex';
                scrollToBottom();

            }, 1500);

        });
    });

    function appendMessage(text, className) {
        const msgNode = document.createElement('div');
        msgNode.className = `chat-msg ${className}`;
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        msgNode.innerHTML = `<p>${text}</p><span class="msg-time">${className === 'user-msg' ? 'Sent' : 'Insight'} &bull; ${timestamp}</span>`;
        chatScroller.appendChild(msgNode);
    }

    function scrollToBottom() {
        chatScroller.scrollTop = chatScroller.scrollHeight;
    }


    // ==========================================
    // 5. SUBSCRIPTION PRICING SCALE SWITCHER
    // ==========================================
    const pricingToggle = document.getElementById('pricing-toggle');
    const lblMonthly = document.getElementById('lbl-monthly');
    const lblYearly = document.getElementById('lbl-yearly');
    const priceNodes = document.querySelectorAll('.price-val');

    pricingToggle.addEventListener('change', () => {
        const isYearly = pricingToggle.checked;

        // Toggle label styling highlights
        if (isYearly) {
            lblMonthly.classList.remove('active');
            lblYearly.classList.add('active');
        } else {
            lblMonthly.classList.add('active');
            lblYearly.classList.remove('active');
        }

        // Cycle elements and recalculate figures with animations
        priceNodes.forEach(node => {
            node.style.transform = 'scale(0.85)';
            node.style.opacity = '0.5';

            setTimeout(() => {
                const priceValue = isYearly ? node.getAttribute('data-yearly') : node.getAttribute('data-monthly');
                node.textContent = priceValue;
                node.style.transform = 'scale(1)';
                node.style.opacity = '1';
            }, 200);
        });
    });

    // Default label setup on start
    lblMonthly.classList.add('active');


    // ==========================================
    // 6. NEWSLETTER SUBSCRIPTION CONTROLLER
    // ==========================================
    const newsForm = document.getElementById('newsletter-form');
    const btnSubscribe = document.getElementById('btn-subscribe');
    const newsEmail = document.getElementById('news-email');
    const newsSuccess = document.getElementById('news-success-msg');

    newsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = newsEmail.value;
        if (!email) return;

        // Visual trigger submit loading
        btnSubscribe.disabled = true;
        btnSubscribe.textContent = "Syncing...";

        setTimeout(() => {
            newsEmail.value = '';
            btnSubscribe.style.display = 'none';
            newsEmail.style.display = 'none';
            
            // Fade-in success notification
            newsSuccess.style.display = 'block';
            newsSuccess.style.opacity = '0';
            
            setTimeout(() => {
                newsSuccess.style.opacity = '1';
            }, 50);

        }, 1000);
    });


    // ==========================================
    // 7. DASHBOARD BILLING SIDEBAR & CHECKOUT SIMULATOR
    // ==========================================
    
    // Sidebar elements
    const sideDash = document.getElementById('db-side-dash');
    const sideBilling = document.getElementById('db-side-billing');
    const overviewPane = document.getElementById('db-overview-pane');
    const billingPane = document.getElementById('db-billing-pane');
    const sidebarItems = document.querySelectorAll('.db-sidebar .side-item');

    // Checkout modal elements
    const checkoutModal = document.getElementById('checkout-modal');
    const btnCloseCheckout = document.getElementById('btn-close-checkout');
    const upgradeButtons = document.querySelectorAll('.btn-bp-buy');
    
    const checkoutPlanName = document.getElementById('checkout-plan-name');
    const checkoutPlanPrice = document.getElementById('checkout-plan-price');
    
    const btnPaytabUpi = document.getElementById('btn-paytab-upi');
    const btnPaytabCard = document.getElementById('btn-paytab-card');
    const payPaneUpi = document.getElementById('pay-pane-upi');
    const payPaneCard = document.getElementById('pay-pane-card');
    
    const btnSimulatePayUpi = document.getElementById('btn-simulate-pay-upi');
    const btnSimulatePayCard = document.getElementById('btn-simulate-pay-card');
    
    const checkoutLoadingPane = document.getElementById('checkout-loading-pane');
    const checkoutSuccessPane = document.getElementById('checkout-success-pane');
    const btnCheckoutSuccessClose = document.getElementById('btn-checkout-success-close');

    // Workspace Live state values
    let currentActivePlan = 'FREE';
    let currentValidity = 'Jun 27, 2026';
    let currentTenantId = '4db1515e-50b6-4715-a515-2d9b4a0488d9';
    let targetUpgradePlan = '';

    // Switch between Dashboard Overview and Billing Portal
    if (sideBilling && sideDash) {
        sideBilling.addEventListener('click', () => {
            sidebarItems.forEach(item => item.classList.remove('active'));
            sideBilling.classList.add('active');
            
            // Toggle displays with smooth transitions
            overviewPane.style.display = 'none';
            billingPane.style.display = 'block';
            billingPane.style.opacity = '0';
            setTimeout(() => {
                billingPane.style.opacity = '1';
                billingPane.style.transition = 'opacity 0.3s ease';
            }, 50);
        });

        sideDash.addEventListener('click', () => {
            sidebarItems.forEach(item => item.classList.remove('active'));
            sideDash.classList.add('active');
            
            billingPane.style.display = 'none';
            overviewPane.style.display = 'block';
            overviewPane.style.opacity = '0';
            setTimeout(() => {
                overviewPane.style.opacity = '1';
                overviewPane.style.transition = 'opacity 0.3s ease';
            }, 50);
        });
    }

    // Connect upgrade "Buy Now" button click events
    upgradeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            targetUpgradePlan = btn.getAttribute('data-upgrade');
            
            let priceText = '₹0.00';
            if (targetUpgradePlan === 'STARTER') priceText = '₹499.00';
            else if (targetUpgradePlan === 'GROWTH') priceText = '₹999.00';
            else if (targetUpgradePlan === 'PRO') priceText = '₹1,999.00';
            
            // Populate Modal values
            checkoutPlanName.textContent = targetUpgradePlan + ' Plan';
            checkoutPlanPrice.textContent = priceText;
            
            // Show Modal Overlay
            checkoutModal.classList.add('active');
            
            // Reset modal pane displays
            payPaneUpi.style.display = 'flex';
            payPaneCard.style.display = 'none';
            btnPaytabUpi.classList.add('active');
            btnPaytabCard.classList.remove('active');
            
            document.querySelector('.checkout-modal-header').style.display = 'block';
            document.querySelector('.checkout-summary-row').style.display = 'flex';
            document.querySelector('.checkout-payment-tabs').style.display = 'grid';
            
            checkoutLoadingPane.style.display = 'none';
            checkoutSuccessPane.style.display = 'none';
        });
    });

    // Close Modal overlay
    if (btnCloseCheckout) {
        btnCloseCheckout.addEventListener('click', () => {
            checkoutModal.classList.remove('active');
        });
    }

    // Modal Payment Method tabs switching
    if (btnPaytabUpi && btnPaytabCard) {
        btnPaytabUpi.addEventListener('click', () => {
            btnPaytabCard.classList.remove('active');
            btnPaytabUpi.classList.add('active');
            payPaneCard.style.display = 'none';
            payPaneUpi.style.display = 'flex';
        });

        btnPaytabCard.addEventListener('click', () => {
            btnPaytabUpi.classList.remove('active');
            btnPaytabCard.classList.add('active');
            payPaneUpi.style.display = 'none';
            payPaneCard.style.display = 'flex';
        });
    }

    // Simulate Pay transaction submissions (UPI or Card)
    const handleSimulatedPayment = () => {
        // Hide payment elements
        payPaneUpi.style.display = 'none';
        payPaneCard.style.display = 'none';
        document.querySelector('.checkout-modal-header').style.display = 'none';
        document.querySelector('.checkout-summary-row').style.display = 'none';
        document.querySelector('.checkout-payment-tabs').style.display = 'none';
        
        // Show validating loader pane
        checkoutLoadingPane.style.display = 'flex';
        
        setTimeout(() => {
            // Hide Loader, show Success checked pane
            checkoutLoadingPane.style.display = 'none';
            checkoutSuccessPane.style.display = 'flex';
            
            // PERFORM LIVE DATABASE UPGRADES STATE TRANSITIONS (WOW Factor!)
            currentActivePlan = targetUpgradePlan;
            
            // Format Validity: Current Date + 30 days
            const date = new Date();
            date.setDate(date.getDate() + 30);
            const opt = { year: 'numeric', month: 'short', day: 'numeric' };
            currentValidity = date.toLocaleDateString('en-US', opt);
            
            // Generate new monospaced Tenant ID to showcase isolated workspaces
            const chars = '0123456789abcdef';
            let newSuffix = '';
            for (let i = 0; i < 12; i++) {
                newSuffix += chars[Math.floor(Math.random() * chars.length)];
            }
            currentTenantId = `4db1515e-50b6-4715-a515-${newSuffix}`;
            
            // Apply updates to the active banner nodes
            document.getElementById('billing-current-tier-title').textContent = `${currentActivePlan} Plan`;
            document.getElementById('billing-current-validity').textContent = currentValidity;
            document.getElementById('billing-tenant-id').textContent = currentTenantId;
            
            // Update Card visual indicators inside Billing grid options
            updateBillingPortalUI();
            
        }, 2000);
    };

    if (btnSimulatePayUpi) btnSimulatePayUpi.addEventListener('click', handleSimulatedPayment);
    if (btnSimulatePayCard) btnSimulatePayCard.addEventListener('click', handleSimulatedPayment);

    // Close success state modal re-direct
    if (btnCheckoutSuccessClose) {
        btnCheckoutSuccessClose.addEventListener('click', () => {
            checkoutModal.classList.remove('active');
        });
    }

    // Sub-routine: Helper to refresh plan card selections in active grid
    function updateBillingPortalUI() {
        const plans = ['free', 'starter', 'growth', 'pro'];
        
        plans.forEach(planName => {
            const card = document.getElementById(`bp-card-${planName}`);
            const flag = document.getElementById(`bp-flag-${planName}`);
            const button = document.getElementById(`bp-btn-${planName}`);
            
            if (planName.toUpperCase() === currentActivePlan) {
                // Highlighting new active plan
                card.classList.add('active-plan-highlight');
                flag.style.display = 'block';
                button.textContent = 'Active';
                button.className = 'bp-btn btn-bp-active';
                button.disabled = true;
            } else {
                // Restore others to purchase states
                card.classList.remove('active-plan-highlight');
                flag.style.display = 'none';
                
                if (planName === 'free') {
                    button.textContent = 'Downgrade';
                    button.className = 'bp-btn btn-bp-buy';
                    button.disabled = false;
                    button.setAttribute('data-upgrade', 'FREE');
                } else {
                    button.textContent = 'Buy Now';
                    button.className = 'bp-btn btn-bp-buy';
                    button.disabled = false;
                    button.setAttribute('data-upgrade', planName.toUpperCase());
                }
            }
        });
        
        // Re-bind click event on downgrade button if FREE card becomes clickable
        const btnFree = document.getElementById('bp-btn-free');
        if (btnFree && !btnFree.disabled) {
            btnFree.addEventListener('click', () => {
                // Direct instant downgrade simulation
                currentActivePlan = 'FREE';
                document.getElementById('billing-current-tier-title').textContent = 'FREE Plan';
                updateBillingPortalUI();
                
                alert("📉 Workspace downgraded back to FREE Plan. Advanced multi-branch pools disabled.");
            });
        }
    }

});
