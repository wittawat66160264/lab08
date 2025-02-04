// Blog Class - รับผิดชอบการจัดการข้อมูลบล็อก
class Blog {
  constructor(id, title, content, createdDate = new Date(), updatedDate = new Date()) {
      this.id = id;
      this.title = title;
      this.content = content;
      this.createdDate = new Date(createdDate);
      this.updatedDate = new Date(updatedDate);
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

// BlogManager Class - รับผิดชอบการจัดการ array ของบล็อก
class BlogManager {
  constructor() {
      const storedBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
      this.blogs = storedBlogs.map(blog => new Blog(blog.id, blog.title, blog.content, blog.createdDate, blog.updatedDate));
  }

  addBlog(title, content) {
      const blog = new Blog(Date.now(), title, content);
      this.blogs.push(blog);
      this.sortBlogs();
      this.saveToLocalStorage();
      return blog;
  }

  updateBlog(id, title, content) {
      const blog = this.getBlog(id);
      if (blog) {
          blog.update(title, content);
          this.sortBlogs();
          this.saveToLocalStorage();
      }
      return blog;
  }

  deleteBlog(id) {
      this.blogs = this.blogs.filter(blog => blog.id !== id);
      this.saveToLocalStorage();
  }

  getBlog(id) {
      return this.blogs.find(blog => blog.id === id);
  }

  sortBlogs() {
      this.blogs.sort((a, b) => new Date(b.updatedDate) - new Date(a.updatedDate));
  }

  saveToLocalStorage() {
      localStorage.setItem("blogs", JSON.stringify(this.blogs));
  }
}

// UI Class - รับผิดชอบการจัดการ DOM และ Events
class BlogUI {
  constructor(blogManager) {
      this.blogManager = blogManager;
      this.initElements();
      this.initEventListeners();
      this.render(); // โหลดข้อมูลเก่า
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
      this.form.addEventListener("submit", (e) => {
          e.preventDefault();
          this.handleSubmit();
      });

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
          this.formTitle.textContent = "แก้ไขบล็อก";
          this.cancelBtn.classList.remove("hidden");
          window.scrollTo(0, 0);
      }
  }

  deleteBlog(id) {
      if (confirm("ต้องการลบบล็อกนี้ใช่หรือไม่?")) {
          this.blogManager.deleteBlog(id);
          this.render();
      }
  }

  resetForm() {
      this.form.reset();
      this.editIdInput.value = "";
      this.formTitle.textContent = "เขียนบล็อกใหม่";
      this.cancelBtn.classList.add("hidden");
  }

  render() {
      this.blogList.innerHTML = this.blogManager.blogs
          .map(
              (blog) => `
              <div class="blog-post">
                  <h2 class="blog-title">${blog.title}</h2>
                  <div class="blog-date">
                      อัพเดทล่าสุด: ${blog.getFormattedDate()}
                  </div>
                  <div class="blog-content">
                      ${blog.content.replace(/\n/g, "<br>")}
                  </div>
                  <div class="blog-actions">
                      <button class="btn-edit" onclick="blogUI.editBlog(${blog.id})">แก้ไข</button>
                      <button class="btn-delete" onclick="blogUI.deleteBlog(${blog.id})">ลบ</button>
                  </div>
              </div>
          `
          )
          .join("");
  }
}

// สร้าง instance และเริ่มใช้งาน
const blogManager = new BlogManager();
const blogUI = new BlogUI(blogManager);
