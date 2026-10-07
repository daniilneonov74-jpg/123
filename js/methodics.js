const subjectTabs = document.querySelectorAll('.subject-tab');
    const subjectPanels = document.querySelectorAll('.subject-panel');
    const viewerModal = document.getElementById('viewerModal');
    const viewerBody = document.getElementById('viewerBody');
    const viewerTitle = document.getElementById('viewerTitle');

    subjectTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.subject;

        subjectTabs.forEach(item => item.classList.toggle('active', item === tab));
        subjectPanels.forEach(panel => {
          panel.classList.toggle('active', panel.dataset.panel === target);
        });
      });
    });

    function openViewer(url, label, kind) {
      viewerTitle.textContent = label;
      viewerBody.innerHTML = '';

      if (kind === 'image') {
        const img = document.createElement('img');
        img.src = url;
        img.alt = label;
        viewerBody.appendChild(img);
      } else if (kind === 'pdf') {
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.title = label;
        viewerBody.appendChild(iframe);
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
        return;
      }

      viewerModal.classList.add('open');
      viewerModal.setAttribute('aria-hidden', 'false');
    }

    function closeViewer() {
      viewerModal.classList.remove('open');
      viewerModal.setAttribute('aria-hidden', 'true');
      viewerBody.innerHTML = '';
    }

    document.getElementById('closeViewer').addEventListener('click', closeViewer);
    viewerModal.addEventListener('click', (event) => {
      if (event.target === viewerModal) closeViewer();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && viewerModal.classList.contains('open')) {
        closeViewer();
      }
    });

    document.querySelectorAll('.resource-card').forEach(card => {
      card.addEventListener('click', event => {
        const url = card.getAttribute('href');
        if (!url) return;
        const lower = url.toLowerCase();
        const isImage = /\.(png|jpg|jpeg|gif|webp|bmp|svg)$/.test(lower);
        const isPdf = lower.endsWith('.pdf');
        if (isImage || isPdf) {
          event.preventDefault();
          const label = card.querySelector('h4')?.textContent || 'Материал';
          openViewer(url, label, isPdf ? 'pdf' : 'image');
        }
      });
    });
