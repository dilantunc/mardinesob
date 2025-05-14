import React, { useState } from "react";

const faqData = [
    {
        question: "Yeni kayıt için gerekli belgeler nelerdir ?",
        answer: "- kimlik fotokopisi, vesikalık ve vergi levhası gereklidir.",
    },
    {
        question: "Sicil müdürlüğünden alınan belgeler nelerdir ?",
        answer: "- Sicil tasdiknamesi , sicil gazetesi ve faaliyet belgesi alınabilir.",
    },
    {
        question: "Sıkça Sorulan Soru 3 nedir?",
        answer: "Sıkça Sorulan Soru 3'ün cevabı burada yer alır.",
    },
];

export default function SSS() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
            <h1>Sık Sorulan Sorular</h1>
            <div>
                {faqData.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: 16 }}>
                        <button
                            onClick={() => toggle(idx)}
                            style={{
                                width: "100%",
                                textAlign: "left",
                                padding: "12px 16px",
                                fontSize: 16,
                                background: "#f5f5f5",
                                border: "1px solid #ddd",
                                borderRadius: 4,
                                cursor: "pointer",
                                outline: "none",
                            }}
                        >
                            {item.question}
                        </button>
                        {openIndex === idx && (
                            <div
                                style={{
                                    background: "#fff",
                                    border: "1px solid #eee",
                                    borderTop: "none",
                                    padding: "12px 16px",
                                    borderRadius: "0 0 4px 4px",
                                }}
                            >
                                {item.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}