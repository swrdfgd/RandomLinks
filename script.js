document.getElementById("mulaiBtn").addEventListener("click", async () => {
	document.getElementById("jumlahLink").value = Math.min(document.getElementById("jumlahLink").value,100);
    const jumlah = parseInt(document.getElementById("jumlahLink").value);
    const hasilContainer = document.getElementById("hasilContainer");
    hasilContainer.innerHTML = "<p>⏳ Loading link...</p>";

    let semuaLink = [];

    for (let i = 0; i < jumlah; i++) {
        const keyword = generateRandomKeyword(); // fungsi ini kamu isi sendiri
        const link = await ambilLinkAcakDariGoogle(keyword);
        if (link) {
            semuaLink.push(link);
        } else {
            i--; // ulang kalau gagal
        }
    }

    hasilContainer.innerHTML = semuaLink.map(url => `<p><a href="${url}" target="_blank">${url}</a></p>`).join("");
});

// Fungsi placeholder untuk generate kata kunci acak
function generateRandomKeyword() {
      let keyword = '';
      while (Math.random() < 1/2 || keyword.length < 1) {
        let pilihanKeyword = wordGen();
		if (Math.random() < 1/2){
			let bagian = pilihanKeyword.split(/[-–—\/,:.;()\[\]\s]+/);
			for (let i = 0; i < bagian.length; i++) {
			  if (Math.random() < 1/2) keyword += bagian[i] + ' ';
			}
		}
		else keyword += pilihanKeyword + ' ';
      }
      keyword = keyword.trim();
	  
      return keyword;
}

// Fungsi ambil link acak dari Google Custom Search API
async function ambilLinkAcakDariGoogle(keyword) {
    console.log("🔍 Cari keyword:", keyword);

    let halaman = 1;
    let semuaHasil = [];

    while (true) {
        const startIndex = ((halaman - 1) * 10) + 1; // API Google: halaman mulai dari 1, 11, 21...
        const url = `https://www.googleapis.com/customsearch/v1?key=${daftarFire[Math.floor(Math.random()*daftarFire.length)]}&cx=${CSE_ID}&q=${encodeURIComponent(keyword)}&start=${startIndex}`;

        try {
            const res = await fetch(url);
            const data = await res.json();

            if (data.items && data.items.length > 0) {
                semuaHasil.push(...data.items.map(item => item.link));
            } else {
                break; // tidak ada hasil → keluar loop
            }
        } catch (err) {
            console.error("Error fetch:", err);
            break;
        }

        if (Math.random() < 0.5) {
            halaman++;
        } else {
            break;
        }
    }

    if (semuaHasil.length > 0) {
        return semuaHasil[Math.floor(Math.random() * semuaHasil.length)];
    } else {
        return null;
    }
}
