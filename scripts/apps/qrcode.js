/**
 * QR Code Generator App
 */

const QRCodeApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        return () => {};
    },

    render() {
        this.container.innerHTML = `
            <div class="qrcode-app">
                <div class="input-area">
                    <textarea id="qr-text" placeholder="Enter text or URL..."></textarea>
                    <button id="gen-qr-btn">Generate QR Code</button>
                </div>
                <div id="qr-result">
                    <p>Enter text above and click generate.</p>
                </div>
                <div class="qr-info">
                    <p><small>Uses the Google Chart API for quick generation.</small></p>
                </div>
            </div>
            <style>
                .qrcode-app { padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 20px; }
                .input-area { width: 100%; display: flex; flex-direction: column; gap: 10px; }
                .qrcode-app textarea { width: 100%; height: 80px; padding: 10px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); resize: none; }
                .qrcode-app button { padding: 10px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer; }
                #qr-result { width: 200px; height: 200px; border: 1px dashed var(--border-color); display: flex; align-items: center; justify-content: center; text-align: center; }
                #qr-result img { max-width: 100%; max-height: 100%; }
                .qr-info { opacity: 0.6; }
            </style>
        `;

        const btn = document.getElementById('gen-qr-btn');
        const text = document.getElementById('qr-text');
        const result = document.getElementById('qr-result');

        btn.onclick = () => {
            const val = text.value.trim();
            if (!val) return;

            result.innerHTML = '<div class="loader"></div>';

            const size = 200;
            const url = `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodeURIComponent(val)}`;

            const img = new Image();
            img.onload = () => {
                result.innerHTML = '';
                result.appendChild(img);

                const dlBtn = document.createElement('button');
                dlBtn.textContent = 'Download Image';
                dlBtn.style.marginTop = '10px';
                dlBtn.onclick = () => {
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'qrcode.png';
                    a.target = '_blank'; // Google charts might need direct visit for download if CORS issues
                    a.click();
                };
                // We'll just show the image, users can right click save.
                // Adding a direct download for external URL can be tricky with CORS.
            };
            img.src = url;
        };
    }
};
