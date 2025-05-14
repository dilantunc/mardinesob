import React from "react";

const BilgilendirmeSayfasi = () => (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <h1>Üyelik İşlemleri Bilgilendirme</h1>
        <p>
            Bu sayfa üzerinden üyelik işlemleri hakkında bilgilere ulaşabilirsiniz. Üyelik başvurusu, üyelik yenileme ve üyelik iptali gibi işlemlerle ilgili detaylar aşağıda yer almaktadır.
        </p>
        <ul>
            <li><strong>Üyelik Başvurusu:</strong> Başvuru formunu doldurarak üyelik talebinizi iletebilirsiniz.</li>
            <li><strong>Üyelik Yenileme:</strong> Mevcut üyeliğinizi yenilemek için hesabınıza giriş yaparak yenileme işlemini başlatabilirsiniz.</li>
            <li><strong>Üyelik İptali:</strong> Üyeliğinizi iptal etmek için destek ekibimizle iletişime geçebilirsiniz.</li>
        </ul>
        <p>
            Daha fazla bilgi için lütfen <a href="/iletisim">iletişim</a> sayfamızı ziyaret edin.
        </p>
    </div>
);

export default BilgilendirmeSayfasi;