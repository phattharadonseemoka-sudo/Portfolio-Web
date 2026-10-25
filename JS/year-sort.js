
// ===== PORTFOLIO YEAR SORT =====

(() => {

    const sortSelect = document.querySelector("#sortYear");
    const gallery = document.querySelector(".Award-gallery");

    if (!sortSelect || !gallery) return;

    // อ่านปีจากการ์ดผลงาน
    function getProjectYear(card) {

        const yearText =
            card.dataset.year ||
            card.querySelector(".year")?.textContent;

        const year = Number(yearText);

        return Number.isInteger(year) && year > 0
            ? year
            : null;
    }

    // เรียงลำดับการ์ด
    function sortProjectsByYear() {

        const direction = sortSelect.value;

        const cards = Array.from(
            gallery.querySelectorAll(":scope > .photo-card")
        );

        cards.sort((a, b) => {

            const yearA = getProjectYear(a);
            const yearB = getProjectYear(b);

            // การ์ดที่ไม่ระบุปีจะอยู่ท้ายสุดเสมอ
            if (yearA === null) return yearB === null ? 0 : 1;
            if (yearB === null) return -1;

            return direction === "asc"
                ? yearA - yearB
                : yearB - yearA;
        });

        // ย้ายเฉพาะการ์ดที่ตำแหน่งยังไม่ถูกต้อง
        // ไม่สร้างการ์ดใหม่ จึงไม่ลบ Event Listener
        cards.forEach((card, index) => {

            if (gallery.children[index] !== card) {
                gallery.insertBefore(
                    card,
                    gallery.children[index] || null
                );
            }

        });

    }

    // เปลี่ยนลำดับเมื่อผู้ใช้เลือก
    sortSelect.addEventListener("change", sortProjectsByYear);

    // ตั้งค่าเริ่มต้น: ปีน้อยไปมาก
    sortSelect.value = "asc";

    sortProjectsByYear();

    // รองรับการ์ดที่โหลดเพิ่มจาก Admin JSON
    const observer = new MutationObserver(records => {

        // ตรวจว่ามีการเพิ่มหรือลบการ์ดจริง
        const hasNewCards = records.some(record =>
            Array.from(record.addedNodes).some(node =>
                node.nodeType === 1 &&
                node.matches?.(".photo-card")
            )
        );

        if (hasNewCards) {
            sortProjectsByYear();
        }

    });

    observer.observe(gallery, {
        childList: true
    });

})();
