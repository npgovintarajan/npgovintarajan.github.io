        let careerData = [];
        let contributionsData = null;
        const baseLabels = [
            "Infrastructure & Systems",
            "Product and Software Engineering",
            "Cybersecurity",
            "Enterprise Architecture",
            "Strategic Leadership",
            "FinOps"
        ];

        let radarChartInstance = null;
        let lineChartInstance = null;
        let currentPhaseIndex = 0;

        function getRadarLayoutWidth() {
            const container = document.querySelector('.chart-container');
            const containerWidth = container?.getBoundingClientRect().width;

            return containerWidth || window.innerWidth;
        }

        function getResponsiveRadarLabels() {
            const layoutWidth = getRadarLayoutWidth();
            const shouldWrapLabels = layoutWidth < 560;

            return baseLabels.map((label) => {
                if (!shouldWrapLabels) {
                    return label;
                }

                if (label === 'Product and Software Engineering') {
                    return ['Product and', 'Software', 'Engineering'];
                }

                if (label === 'Infrastructure & Systems') {
                    return ['Infrastructure', '& Systems'];
                }

                if (label === 'Enterprise Architecture') {
                    return ['Enterprise', 'Architecture'];
                }

                if (label === 'Strategic Leadership') {
                    return ['Strategic', 'Leadership'];
                }

                return label;
            });
        }

        function getRadarPointLabelFontSize() {
            const layoutWidth = getRadarLayoutWidth();

            if (layoutWidth < 420) {
                return 8;
            }

            if (layoutWidth < 560) {
                return 9;
            }

            if (layoutWidth < 720) {
                return 10;
            }

            return 11;
        }

        function refreshResponsiveLabels() {
            if (!radarChartInstance) {
                return;
            }

            radarChartInstance.data.labels = getResponsiveRadarLabels();
            radarChartInstance.options.scales.r.pointLabels.font.size = getRadarPointLabelFontSize();
            radarChartInstance.update();
        }

        async function initApp() {
            const [careerLoaded, contributionsLoaded] = await Promise.all([
                loadCareerData(),
                loadContributionsData()
            ]);

            if (!careerLoaded) {
                return;
            }

            if (contributionsLoaded) {
                renderContributionsSection();
            }

            renderNavigation();
            initCharts();
            selectPhase(0);
        }

        async function loadCareerData() {
            try {
                const response = await fetch('data/career-phases.json');
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const payload = await response.json();
                if (!Array.isArray(payload) || payload.length === 0) {
                    throw new Error('Career data is empty or invalid');
                }

                careerData = payload;
                return true;
            } catch (error) {
                const errorBanner = document.getElementById('data-error');
                errorBanner.classList.remove('hidden');
                console.error('Failed to load career data:', error);
                return false;
            }
        }

        async function loadContributionsData() {
            try {
                const response = await fetch('data/contributions.json');
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const payload = await response.json();
                if (!payload || !Array.isArray(payload.categories)) {
                    throw new Error('Contributions data is empty or invalid');
                }

                contributionsData = payload;
                return true;
            } catch (error) {
                const errorBanner = document.getElementById('contributions-error');
                errorBanner.classList.remove('hidden');
                console.error('Failed to load contributions data:', error);
                return false;
            }
        }

        function renderContributionsSection() {
            if (!contributionsData) {
                return;
            }

            document.getElementById('contributions-title').innerText = contributionsData.intro?.title || 'Contributions';
            document.getElementById('contributions-description').innerText = contributionsData.intro?.description || '';
            document.getElementById('contributions-profile-title').innerText = contributionsData.profile?.title || 'Profile & Expertise';
            document.getElementById('contributions-profile-description').innerText = contributionsData.profile?.description || '';

            const linkedinLink = document.getElementById('contributions-profile-linkedin');
            if (contributionsData.profile?.linkedin_url) {
                linkedinLink.href = contributionsData.profile.linkedin_url;
                linkedinLink.classList.remove('hidden');
            } else {
                linkedinLink.classList.add('hidden');
            }

            const profileSkills = document.getElementById('contributions-profile-skills');
            profileSkills.innerHTML = '';
            (contributionsData.profile?.skills || []).forEach((skill) => {
                const skillChip = document.createElement('div');
                skillChip.className = 'rounded-lg border border-[#dda15e]/30 bg-[#fefae0] px-3 py-2 text-sm font-semibold text-[#283618]';
                skillChip.innerText = skill;
                profileSkills.appendChild(skillChip);
            });

            document.getElementById('contributions-ecosystem-title').innerText = contributionsData.ecosystem?.title || 'Global Ecosystem Contributions';

            const ecosystemItems = document.getElementById('contributions-ecosystem-items');
            ecosystemItems.innerHTML = '';
            (contributionsData.ecosystem?.items || []).forEach((item) => {
                const pill = document.createElement('div');
                pill.className = 'bg-[#fefae0] p-3 rounded border border-[#dda15e]/30 font-medium';
                pill.innerText = item;
                ecosystemItems.appendChild(pill);
            });

            const categoriesContainer = document.getElementById('contributions-categories');
            categoriesContainer.innerHTML = '';

            contributionsData.categories.forEach((category) => {
                const article = document.createElement('article');
                article.className = 'rounded-xl border border-[#dda15e]/30 bg-[#fefae0] p-5 shadow-sm flex flex-col gap-4';

                const title = document.createElement('h4');
                title.className = 'text-sm font-bold uppercase tracking-[0.2em] text-[#606c38]';
                title.innerText = category.title;
                article.appendChild(title);

                const description = document.createElement('p');
                description.className = 'text-sm leading-relaxed text-[#283618]';
                description.innerText = category.description || '';
                article.appendChild(description);

                categoriesContainer.appendChild(article);
            });

            renderContributionReferences();
        }

        function renderContributionReferences() {
            const references = contributionsData?.references;
            const referencesSection = document.getElementById('contributions-references');
            const groupsContainer = document.getElementById('contributions-reference-groups');

            if (!references || !Array.isArray(references.groups) || references.groups.length === 0) {
                referencesSection.classList.add('hidden');
                return;
            }

            referencesSection.classList.remove('hidden');
            document.getElementById('contributions-references-title').innerText = references.title || 'Contribution References';
            document.getElementById('contributions-references-description').innerText = references.description || '';
            groupsContainer.innerHTML = '';

            references.groups.forEach((group) => {
                const groupCard = document.createElement('section');
                groupCard.className = 'rounded-xl border border-[#dda15e]/30 bg-white p-5 shadow-sm flex flex-col gap-4';

                const title = document.createElement('h5');
                title.className = 'text-sm font-bold uppercase tracking-[0.18em] text-[#606c38]';
                title.innerText = group.title;
                groupCard.appendChild(title);

                const items = Array.isArray(group.items) ? group.items : [];
                if (items.length === 0) {
                    const emptyState = document.createElement('p');
                    emptyState.className = 'text-sm leading-relaxed text-[#606c38]';
                    emptyState.innerText = 'No references added yet.';
                    groupCard.appendChild(emptyState);
                    groupsContainer.appendChild(groupCard);
                    return;
                }

                if (group.title === 'Embedded Videos') {
                    const videosBlock = document.createElement('div');
                    videosBlock.className = 'flex flex-col gap-4';

                    items.forEach((video) => {
                        if (!video.embedUrl) {
                            return;
                        }

                        const videoCard = document.createElement('div');
                        videoCard.className = 'flex flex-col gap-2';

                        const videoTitle = document.createElement('p');
                        videoTitle.className = 'text-sm font-semibold text-[#283618]';
                        videoTitle.innerText = video.label || video.title || 'Embedded video';
                        videoCard.appendChild(videoTitle);

                        const frameWrapper = document.createElement('div');
                        frameWrapper.className = 'overflow-hidden rounded-lg border border-[#dda15e]/30 bg-[#fefae0]';

                        const iframe = document.createElement('iframe');
                        iframe.src = video.embedUrl;
                        iframe.title = video.title || video.label || 'Contribution video';
                        iframe.loading = 'lazy';
                        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
                        iframe.allowFullscreen = true;
                        iframe.className = 'aspect-video w-full';
                        frameWrapper.appendChild(iframe);
                        videoCard.appendChild(frameWrapper);

                        if (video.url) {
                            const videoLink = document.createElement('a');
                            videoLink.href = video.url;
                            videoLink.target = '_blank';
                            videoLink.rel = 'noreferrer noopener';
                            videoLink.className = 'text-xs font-semibold text-[#bc6c25] underline underline-offset-4';
                            videoLink.innerText = 'Open source link';
                            videoCard.appendChild(videoLink);
                        }

                        videosBlock.appendChild(videoCard);
                    });

                    groupCard.appendChild(videosBlock);
                    groupsContainer.appendChild(groupCard);
                    return;
                }

                const linksBlock = document.createElement('div');
                linksBlock.className = 'flex flex-wrap gap-2';
                items.forEach((item) => {
                    const link = document.createElement('a');
                    link.href = item.url;
                    link.target = '_blank';
                    link.rel = 'noreferrer noopener';
                    link.className = 'rounded-full border border-[#bc6c25]/30 bg-[#fefae0] px-3 py-1.5 text-xs font-semibold text-[#bc6c25] transition hover:bg-[#bc6c25] hover:text-white';
                    link.innerText = item.label;
                    linksBlock.appendChild(link);
                });
                groupCard.appendChild(linksBlock);
                groupsContainer.appendChild(groupCard);
            });
        }

        function renderNavigation() {
            const navContainer = document.getElementById('timeline-nav');
            navContainer.innerHTML = '';
            careerData.forEach((phase, index) => {
                const btn = document.createElement('button');
                btn.className = `timeline-btn text-left px-4 py-3 rounded-lg text-[#283618] bg-white border border-[#e5e5e5] w-full focus:outline-none focus:ring-2 focus:ring-[#bc6c25]`;
                btn.innerHTML = `<span class="block text-sm font-bold text-[#bc6c25]">${phase.period}</span><span class="block text-xs mt-1 whitespace-normal break-words leading-snug">${phase.role}</span>`;
                btn.onclick = () => selectPhase(index);
                btn.id = `nav-btn-${index}`;
                navContainer.appendChild(btn);
            });
        }

        function selectPhase(index) {
            currentPhaseIndex = index;
            const phase = careerData[index];
            
            document.querySelectorAll('.timeline-btn').forEach(b => b.classList.remove('active'));
            document.getElementById(`nav-btn-${index}`).classList.add('active');

            document.getElementById('phase-title').innerText = phase.period;
            document.getElementById('phase-role').innerText = phase.role;
            document.getElementById('phase-story').innerText = phase.story;
            document.getElementById('phase-tech').innerText = phase.tech;
            document.getElementById('phase-challenges').innerText = phase.challenges;

            updateRadarChart(phase.skills);
            renderSkillScorecard(phase.skills);
        }

        function renderSkillScorecard(skills) {
            const scorecard = document.getElementById('skills-scorecard');
            if (!scorecard) {
                return;
            }

            scorecard.innerHTML = '';

            baseLabels.forEach((label, index) => {
                const item = document.createElement('div');
                item.className = 'rounded-lg border border-[#dda15e]/30 bg-[#fefae0] px-3 py-2';
                item.innerHTML = `<p class="font-semibold leading-snug">${label}</p><p class="mt-1 text-[#bc6c25] font-bold">${skills[index]}/10</p>`;
                scorecard.appendChild(item);
            });
        }

        function initCharts() {
            const radarCtx = document.getElementById('skillsRadarChart').getContext('2d');
            radarChartInstance = new Chart(radarCtx, {
                type: 'radar',
                data: {
                    labels: getResponsiveRadarLabels(),
                    datasets: [{
                        label: 'Skill Proficiency Level',
                        data: [0, 0, 0, 0, 0, 0],
                        backgroundColor: 'rgba(188, 108, 37, 0.4)',
                        borderColor: 'rgba(188, 108, 37, 1)',
                        pointBackgroundColor: 'rgba(96, 108, 56, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(96, 108, 56, 1)',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            min: 0,
                            max: 10,
                            angleLines: { color: 'rgba(0,0,0,0.1)' },
                            grid: { color: 'rgba(0,0,0,0.1)' },
                            pointLabels: {
                                color: '#283618',
                                font: { size: getRadarPointLabelFontSize(), weight: 'bold' }
                            },
                            ticks: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.label + ': ' + context.raw + '/10';
                                }
                            }
                        }
                    }
                }
            });

            const periods = careerData.map(d => d.period);
            const infraData = careerData.map(d => d.skills[0]);
            const securityData = careerData.map(d => d.skills[2]);
            const archData = careerData.map(d => d.skills[3]);

            const lineCtx = document.getElementById('trajectoryLineChart').getContext('2d');
            lineChartInstance = new Chart(lineCtx, {
                type: 'line',
                data: {
                    labels: periods,
                    datasets: [
                        {
                            label: 'Cybersecurity',
                            data: securityData,
                            borderColor: '#bc6c25',
                            backgroundColor: 'rgba(188, 108, 37, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.3
                        },
                        {
                            label: 'Enterprise Architecture',
                            data: archData,
                            borderColor: '#606c38',
                            backgroundColor: 'transparent',
                            borderWidth: 3,
                            borderDash: [5, 5],
                            tension: 0.3
                        },
                        {
                            label: 'Infrastructure & Systems',
                            data: infraData,
                            borderColor: '#dda15e',
                            backgroundColor: 'transparent',
                            borderWidth: 2,
                            tension: 0.3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 10,
                            title: {
                                display: true,
                                text: 'Proficiency / Focus Level',
                                color: '#606c38',
                                font: { weight: 'bold' }
                            }
                        },
                        x: {
                            ticks: { color: '#283618', maxRotation: 45, minRotation: 45 }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                font: { family: 'sans-serif' },
                                color: '#283618'
                            }
                        }
                    }
                }
            });
        }

        function updateRadarChart(newData) {
            if (radarChartInstance) {
                radarChartInstance.data.datasets[0].data = newData;
                radarChartInstance.update();
            }
        }

        document.addEventListener('DOMContentLoaded', initApp);
        window.addEventListener('resize', refreshResponsiveLabels);

