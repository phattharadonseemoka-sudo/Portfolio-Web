const buttons = document.querySelectorAll(".filter-category button");
const projectPopup = document.querySelector("#projectPopup");
const closePopup = document.querySelector(".popup-close");

// เก็บข้อมูลกิจกรรมที่โหลดจาก Local Admin
const savedProjectsMap = new Map();

const awardGallery = document.querySelector(".Award-gallery");

let mediaSlides = document.querySelectorAll(".media-slide");

const prevButton = document.querySelector(".media-prev");
const nextButton = document.querySelector(".media-next");
const mediaCounter = document.querySelector(".media-counter");

// ===== PROJECT DETAILS DATABASE =====

const projects = {
    // ===== TPA ROBO RESCUE 2024 =====

    "tpa-rescue-2024": {

        // ชื่อกิจกรรม
        title: "TPA Robo Rescue",

        // ประเภทและปี
        category: "ROBOTICS COMPETITION",
        year: "2024",

        // บทบาทและหน้าที่
        role: "ระบุหน้าที่ที่รับผิดชอบในการแข่งขัน",

        // รางวัลที่ได้รับ
        achievement: "รองชนะเลิศอันดับ 2",

        // รายละเอียดกิจกรรม
        description: "เข้าร่วมการแข่งขันหุ่นยนต์กู้ภัย ส.ส.ท.–สพฐ. ยุวชน ครั้งที่ 24 โดยประยุกต์ความรู้ด้านการออกแบบกลไก การเขียนโปรแกรม และการแก้ปัญหาเฉพาะหน้า",

        // รูปภาพและวิดีโอ
        media: [
            {
                type: "image",
                src: "../Image/TPArobot2024.png",
                alt: "ภาพการแข่งขัน TPA Robo Rescue"
            },
            {
                type: "video",
                src: "../Video/TPA2024clip.mp4"
            }
        ]
    }
};

// ===== MEDIA STATE =====

let currentSlide = 0;

// ===== FILTER CATEGORY =====

// แสดงเฉพาะกิจกรรมในหมวดที่เลือก
buttons.forEach(button => {

    button.addEventListener("click", () => {

        const category = button.textContent.trim();

        const showAll = [
            "ทั้งหมด",
            "ทุกประเภท"
        ].includes(category);

        // เปลี่ยนสถานะปุ่ม
        buttons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        // ค้นหาการ์ดทุกครั้ง รวมถึงการ์ดจาก Admin
        document.querySelectorAll(".photo-card").forEach(card => {

            card.hidden = !(
                showAll ||
                category === card.dataset.category
            );
        });
        console.log("Selected category:", category);
    });
});

// ===== MEDIA GALLERY =====

// แสดง Slide ปัจจุบัน และหยุดวิดีโอที่ถูกซ่อน
function showSlide(index) {

    mediaSlides.forEach((slide, i) => {
        slide.hidden = i !== index;
        const video = slide.querySelector("video");

        if (video) {

            if (i === index && projectPopup.open) {

                video.play().catch(error => {
                    console.log("Autoplay blocked:", error);
                });
            } else {

                video.pause();
            }
        }
    });

    // อัปเดตจำนวนสื่อ
    mediaCounter.textContent = mediaSlides.length
        ? `${index + 1} / ${mediaSlides.length}`
        : "0 / 0";

}

// ===== DYNAMIC POPUP CONTENT =====

// สำรองข้อความและ Slide ดั้งเดิม
const originalPopup = {

    title: document.querySelector("#popupTitle").textContent,
    category: document.querySelector("#popupCategory").textContent,
    role: document.querySelector(".popup-role p").textContent,
    achievement: document.querySelector(".popup-award p").textContent,
    description: document.querySelector(".popup-description p").textContent,

    slides: Array.from(
        document.querySelectorAll(".popup-media .media-slide")
    ).map(slide => slide.cloneNode(true))

};


// ===== UPDATE POPUP TEXT =====

function updatePopupText(project) {

    // ชื่อกิจกรรม
    document.querySelector("#popupTitle").textContent =
        project.title || "";

    // ประเภทและปี
    document.querySelector("#popupCategory").textContent =
        `${project.category || ""} · ${project.year || ""}`;

    // ตำแหน่งและหน้าที่
    document.querySelector(".popup-role p").textContent =
        project.role || "-";

    // รางวัลที่ได้รับ
    document.querySelector(".popup-award p").textContent =
        project.achievement || "-";

    // คำอธิบายกิจกรรม
    document.querySelector(".popup-description p").textContent =
        project.description || "-";

}


// ===== UPDATE POPUP MEDIA =====

function updatePopupMedia(project) {

    const container = document.querySelector(".popup-media");
    const controls = container.querySelector(".media-controls");

    // หยุดวิดีโอเดิมก่อนลบ Slide
    container.querySelectorAll("video").forEach(video => {
        video.pause();
    });

    // ลบ Slide เก่า แต่เก็บปุ่มควบคุมไว้
    container.querySelectorAll(".media-slide").forEach(slide => {
        slide.remove();
    });

    // อ่านรายการสื่อจากกิจกรรม
    const items = Array.isArray(project.media)
        ? [...project.media]
        : [];

    // หากไม่มีรูปภายใน ให้ใช้ภาพปกแทน
    if (items.length === 0 && project.cover) {

        items.push({
            type: "image",
            src: project.cover
        });

    }

    // สร้าง Slide จากรายการสื่อ
    items.forEach(item => {

        if (
            !item.src ||
            !["image", "video"].includes(item.type)
        ) {
            return;
        }

        const slide = document.createElement("div");
        slide.className = "media-slide";
        let element;

        // ===== IMAGE =====

        if (item.type === "image") {

            element = document.createElement("img");
            element.className = "popup-image";
            element.src = item.src;
            element.alt =
                item.originalName ||
                item.alt ||
                project.title ||
                "ภาพกิจกรรม";

        }

        // ===== VIDEO =====

        else {

            element = document.createElement("video");
            element.className = "popup-video";
            element.src = item.src;
            element.controls = true;
            element.playsInline = true;
            element.preload = "metadata";
        }

        slide.appendChild(element);

        // เพิ่ม Slide ก่อนแถบควบคุม
        container.insertBefore(slide, controls);
    });

    // อัปเดตรายการ Slide ใหม่
    mediaSlides = container.querySelectorAll(".media-slide");
    currentSlide = 0;
    showSlide(currentSlide);
}

// ===== RESTORE ORIGINAL POPUP =====

// ใช้กับการ์ดเดิมที่ยังไม่ได้เพิ่มข้อมูลใน Admin
function restoreOriginalPopup() {

    document.querySelector("#popupTitle").textContent =
        originalPopup.title;

    document.querySelector("#popupCategory").textContent =
        originalPopup.category;

    document.querySelector(".popup-role p").textContent =
        originalPopup.role;

    document.querySelector(".popup-award p").textContent =
        originalPopup.achievement;

    document.querySelector(".popup-description p").textContent =
        originalPopup.description;

    const container = document.querySelector(".popup-media");
    const controls = container.querySelector(".media-controls");

    // หยุดวิดีโอทั้งหมด
    container.querySelectorAll("video").forEach(video => {
        video.pause();
    });

    // ลบ Slide ปัจจุบัน
    container.querySelectorAll(".media-slide").forEach(slide => {
        slide.remove();
    });

    // คืน Slide ดั้งเดิม
    originalPopup.slides.forEach(slide => {

        container.insertBefore(
            slide.cloneNode(true),
            controls
        );
    });

    mediaSlides = container.querySelectorAll(".media-slide");
    currentSlide = 0;
    showSlide(currentSlide);

}

// ===== OPEN DYNAMIC PROJECT POPUP =====

// ใช้ Event Delegation เพื่อรองรับการ์ดใหม่จาก Admin
awardGallery.addEventListener("click", event => {

    const card = event.target instanceof Element
        ? event.target.closest(".photo-card")
        : null;

    if (!card || !awardGallery.contains(card)) {
        return;
    }

    // อ่านรหัสกิจกรรม
    const projectId = card.dataset.project;
    // ค้นหาข้อมูลจาก Local Admin
    const adminProject = savedProjectsMap.get(projectId);

    if (adminProject) {

        // กิจกรรมที่เพิ่มจาก Admin
        updatePopupText(adminProject);
        updatePopupMedia(adminProject);

    } else {

        // ค้นหาข้อมูลกิจกรรมเก่าจาก projects
        const oldProject = (
            typeof projects !== "undefined" &&
            projects[projectId]
        )
            ? projects[projectId]
            : null;

        if (oldProject) {
            updatePopupText(oldProject);
            updatePopupMedia(oldProject);
        } else {
            // การ์ดเดิมที่ยังไม่มีรายละเอียดเฉพาะ
            restoreOriginalPopup();
        }
    }

    // เปิด Popup
    projectPopup.showModal();
    // เริ่มแสดงสื่อชิ้นแรก
    showSlide(0);

});

// ===== CLOSE POPUP BUTTON =====

closePopup.addEventListener("click", () => {

    projectPopup.close();

});

// ===== NEXT MEDIA =====

nextButton.addEventListener("click", () => {

    if (!mediaSlides.length) return;

    currentSlide =
        (currentSlide + 1) % mediaSlides.length;

    showSlide(currentSlide);

});

// ===== PREVIOUS MEDIA =====

prevButton.addEventListener("click", () => {

    if (!mediaSlides.length) return;

    currentSlide =
        (currentSlide - 1 + mediaSlides.length) %
        mediaSlides.length;

    showSlide(currentSlide);

});

// ===== CLOSE POPUP EVENT =====

// หยุดวิดีโอและกลับสู่ Slide แรก
projectPopup.addEventListener("close", () => {

    mediaSlides.forEach(slide => {
        const video = slide.querySelector("video");

        if (video) {
            video.pause();
        }
    });

    currentSlide = 0;
    showSlide(currentSlide);
});

// ===== LOAD PROJECTS FROM LOCAL ADMIN =====
// ===== CREATE PROJECT CARD =====

function createProjectCard(project) {

    const card = document.createElement("button");
    card.type = "button";
    card.className = "photo-card";

    // กำหนดรหัสกิจกรรมและประเภท
    card.dataset.project = project.id;
    card.dataset.category = project.category;

    // ===== COVER IMAGE =====

    const image = document.createElement("img");
    image.className = "project-image";
    image.src = project.cover;
    image.alt = project.title;
    image.loading = "lazy";


    // ===== PROJECT INFORMATION =====

    const info = document.createElement("div");
    info.className = "info";


    // ปีที่เข้าร่วม
    const year = document.createElement("span");
    year.className = "year";
    year.textContent = project.year;

    // ชื่อกิจกรรม
    const title = document.createElement("h3");
    title.textContent = project.title;

    // คำอธิบายย่อ
    const description = document.createElement("p");

    const summary =
        project.description ||
        project.achievement ||
        "";

    description.textContent = summary.length > 160
        ? summary.slice(0, 160) + "..."
        : summary;


    // ประกอบการ์ด
    info.append(year, title, description);
    card.append(image, info);
    return card;

}
// ===== FETCH PROJECT DATA =====

async function loadAdminProjects() {
    try {

        // ขอข้อมูลกิจกรรมจาก Local Server
        
        // ===== SELECT PROJECT DATA SOURCE =====

        // ตรวจสอบว่ากำลังใช้งาน BiNET Local Admin หรือไม่
        const isLocalAdmin = (
            ["127.0.0.1", "localhost"].includes(window.location.hostname) &&
            window.location.port === "3000"
        );

        // เลือกแหล่งข้อมูลตามสภาพแวดล้อม
        const dataURL = isLocalAdmin
            ? "/api/projects"
            : "../data/projects.json";

        // โหลดข้อมูลกิจกรรม
        const response = await fetch(dataURL, {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("ไม่สามารถโหลดข้อมูลกิจกรรมได้");
        }

        const savedProjects = await response.json();

        // ตรวจสอบรูปแบบ JSON
        if (!Array.isArray(savedProjects)) {
            throw new Error("รูปแบบข้อมูลกิจกรรมไม่ถูกต้อง");
        }

        // ===== SAVE PROJECTS IN MAP =====

        savedProjectsMap.clear();

        savedProjects.forEach(project => {
            savedProjectsMap.set(
                String(project.id),
                project
            );
        });

        // ===== CREATE CARDS =====

        // ใช้ prepend() จึงวนข้อมูลตามลำดับปกติ
        // เพื่อให้กิจกรรมที่บันทึกใหม่อยู่ด้านบนสุด
        savedProjects.forEach(project => {
            const card = createProjectCard(project);
            awardGallery.prepend(card);

        });

        // ===== RESTORE ACTIVE FILTER =====

        const activeFilter = document.querySelector(
            ".filter-category button.active"
        );

        if (activeFilter) {

            const category = activeFilter.textContent.trim();
            const showAll = [
                "ทั้งหมด",
                "ทุกประเภท"
            ].includes(category);

            document.querySelectorAll(".photo-card").forEach(card => {
                card.hidden = !showAll &&
                    card.dataset.category !== category;

            });
        }
        console.log(
            "Loaded projects from Admin:",
            savedProjects.length
        );

    } catch (error) {
        console.error(
            "Admin project loading failed:",
            error
        );
    }
}

// ===== INITIALIZE =====

// โหลดกิจกรรมจาก Local Admin เมื่อเปิดหน้า Award
loadAdminProjects();