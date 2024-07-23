<template>
  <div>
    <button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#customModal"
    >
      Add New Task
    </button>

    <div
      class="modal fade"
      id="customModal"
      tabindex="-1"
      aria-labelledby="modalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalLabel">Add New Task</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <!-- Title -->
              <div class="mb-3">
                <label for="title" class="form-label">Title</label>
                <input
                  v-model="task.title"
                  type="text"
                  id="title"
                  class="form-control"
                  placeholder="Enter title"
                />
                <div v-if="errors.title" class="invalid-feedback">
                  {{ errors.title }}
                </div>
              </div>
              <!-- Description -->
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <input
                  v-model="task.description"
                  type="text"
                  id="description"
                  class="form-control"
                  placeholder="Enter Description"
                />
                <div v-if="errors.description" class="invalid-feedback">
                  {{ errors.description }}
                </div>
              </div>
              <!-- Status -->
              <div class="mb-3">
                <label for="status" class="form-label">Status</label>
                <select v-model="task.status" id="status" class="form-select">
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
                <div v-if="errors.status" class="invalid-feedback">
                  {{ errors.status }}
                </div>
              </div>
              <!-- Categories -->
              <div class="mb-3">
                <label for="categories" class="form-label">Categories</label>
                <select
                  v-model="task.categories"
                  id="categories"
                  class="form-select"
                  multiple
                >
                  <template v-if="allCategories && allCategories.length > 0">
                    <option
                      v-for="category in allCategories"
                      :key="category.id"
                      :value="category.id"
                    >
                      {{ category.name }}
                    </option>
                  </template>
                  <option v-else disabled>No categories available</option>
                </select>
                <div v-if="errors.categories" class="invalid-feedback">
                  {{ errors.categories }}
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" class="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";
import axiosInstance from "../axios"; 

export default {
  name: "AddTaskComponent",
  data() {
    return {
      task: {
        title: "",
        description: "",
        status: "pending",
        categories: [], 
      },
      allCategories: [], 
      errors: {},
    };
  },
  async created() {
    try {
      const response = await axiosInstance.get("/categories");
      if (response.data && response.data.data) {
        this.allCategories = response.data.data.data; 
        console.log(this.allCategories); 
      } else {
        console.warn("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  },
  methods: {
    async submitForm() {
      try {
        await axiosInstance.post("/tasks/store", this.task);
        this.resetForm();
        this.$emit("taskAdded");

        const modalElement = document.getElementById("customModal");
        const modalInstance = Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        } else {
          new Modal(modalElement).hide();
        }
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.processErrors(error.response.data.errors);
        } else if (error.response && error.response.status === 401) {
          console.error(
            "Unauthorized: Please check your authentication credentials."
          );
        } else {
          console.error("An unexpected error occurred:", error);
        }
      }
    },
    processErrors(errors) {
      const flattenedErrors = {};
      for (const [field, messages] of Object.entries(errors)) {
        flattenedErrors[field] = messages.join(", ");
      }
      this.errors = flattenedErrors;
    },
    resetForm() {
      this.task.title = "";
      this.task.description = "";
      this.task.status = "pending";
      this.task.categories = [];
      this.errors = {};
    },
  },
};
</script>
