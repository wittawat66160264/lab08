// Blog Class - ร์บผิดชอบจดการ์ขีอมล็บล็อก
class Blog {
    constructor(id, title, content) {
      this.id = id;
      this.title = title;
      this.content = content;
      this.createdDate = new Date();
      this.updatedDate = new Date();
    }
    update(title, content) {
      this.title = title;
      this.content = content;
      this.updatedDate = new Date();
    }
    getFormattedDate() {
      return this.updatedDate.toLocaleString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
   }
   // BlogManager Class - ร์บผิดชอบจดการ์ array ขีองบล็อก
   class BlogManager {
    constructor() {
      this.blogs = [];
    }
    addBlog(title, content) {
      const blog = new Blog(Date.now(), title, content);
      this.blogs.push(blog);
      this.sortBlogs();
      return blog;
    }
    updateBlog(id, title, content) {
      const blog = this.getBlog(id);
      if (blog) {
        blog.update(title, content);
        this.sortBlogs();
      }
      return blog;
    }
    deleteBlog(id) {
      this.blogs = this.blogs.filter((blog) => blog.id !== id);
    }
    getBlog(id) {
      return this.blogs.find((blog) => blog.id === id);
    }
    sortBlogs() {
      this.blogs.sort((a, b) => b.updatedDate - a.updatedDate);
    }
   }
   // UI Class - ร์บผิดชอบจดการ์ DOM แล็ะ Events
   class BlogUI {
    constructor(blogManager) {
      this.blogManager = blogManager;
      this.initElements();
      this.initEventListeners();
      this.render();
    }
    initElements() {
      this.form = document.getElementById("blog-form");
      this.titleInput = document.getElementById("title");
      this.contentInput = document.getElementById("content");
      this.editIdInput = document.getElementById("edit-id");
      this.formTitle = document.getElementById("form-title");
      this.cancelBtn = document.getElementById("cancel-btn");
      this.blogList = document.getElementById("blog-list");
    }
    initEventListeners() {
      // จดการ์การ์ submit form
      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
      // จดการ์ปุ่มยกเล็ก
      this.cancelBtn.addEventListener("click", () => {
        this.resetForm();
      });
    }
    handleSubmit() {
      const title = this.titleInput.value.trim();
      const content = this.contentInput.value.trim();
      const editId = parseInt(this.editIdInput.value);
      if (title && content) {
        if (editId) {
          this.blogManager.updateBlog(editId, title, content);
        } else {
          this.blogManager.addBlog(title, content);
        }
        this.resetForm();
        this.render();
      }
    }
    editBlog(id) {
      const blog = this.blogManager.getBlog(id);
      if (blog) {
        this.titleInput.value = blog.title;
        this.contentInput.value = blog.content;
        this.editIdInput.value = blog.id;
        this.formTitle.textContent = "แกไขีบล็อก";
        this.cancelBtn.classList.remove("hidden");
        window.scrollTo(0, 0);
      }
    }
    deleteBlog(id) {
      if (confirm("ต้องการ์ล็บบล็อกนใชหร์อไม?")) {
        this.blogManager.deleteBlog(id);
        this.render();
      }
    }
    resetForm() {
      this.form.reset();
      this.editIdInput.value = "";
      this.formTitle.textContent = "เขียนบล็อกใหม";
      this.cancelBtn.classList.add("hidden");
    }
    render() {
      this.blogList.innerHTML = this.blogManager.blogs
        .map(
          (blog) => `
            <div class="blog-post">
                <h2 class="blog-title">${blog.title}</h2>
                <div class="blog-date">
                    อพิ่เดทึเมอ: ${blog.getFormattedDate()}
                </div>
                <div class="blog-content">
                    ${blog.content.replace(/\n/g, "<br>")}
                </div>
                <div class="blog-actions">
                    <button class="btn-edit" onclick="blogUI.editBlog(${
                      blog.id
                    })">แกไขี</button>
                    <button class="btn-delete" onclick="blogUI.deleteBlog(${
                      blog.id
                    })">ล็บ</button>
                </div>
            </div>
        `
        )
        .join("");
    }
   }
   // สร์าง instance แล็ะเร์มต้นใชงาน
   const blogManager = new BlogManager();
   const blogUI = new BlogUI(blogManager);