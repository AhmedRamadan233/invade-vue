<template>
  <div>
    <button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="modal"
      :data-bs-target="`#editTaskModal${task.id}`"
    >
      Edit Task
    </button>

    <div
      class="modal fade"
      :id="`editTaskModal${task.id}`"
      tabindex="-1"
      aria-labelledby="modalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalLabel">Edit Task</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <!-- Hidden input for task ID -->
              <input type="hidden" v-model="localTask.id" />

              <!-- Title -->
              <div class="mb-3">
                <label for="title" class="form-label">Title</label>
                <input
                  v-model="localTask.title"
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
                  v-model="localTask.description"
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
                <select
                  v-model="localTask.status"
                  id="status"
                  class="form-select"
                >
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
                  v-model="localTask.categories"
                  id="categories"
                  class="form-select"
                  multiple
                >
                  <template v-if="allCategories.length > 0">
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
  name: "EditTaskComponent",
  props: {
    task: Object, 
  },
  data() {
    return {
      localTask: { ...this.task }, 
      errors: {},
      allCategories: [], 
    };
  },
  async created() {
    try {
      const response = await axiosInstance.get("/categories");
      if (response.data && response.data.data) {
        this.allCategories = response.data.data.data; 
      } else {
        console.warn("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  },
  watch: {
    task: {
      handler(newTask) {
        this.localTask = { ...newTask }; 
      },
      deep: true,
    },
  },
  methods: {
    async submitForm() {
      try {
        await axiosInstance.put(`/tasks/update`, {
          id: this.localTask.id, 
          title: this.localTask.title,
          description: this.localTask.description,
          status: this.localTask.status,
          categories: this.localTask.categories, 
        });
        this.$emit("taskUpdated");
        const modalElement = document.getElementById(
          `editTaskModal${this.localTask.id}`
        );
        const modalInstance = Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        } else {
          new Modal(modalElement).hide();
        }
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.processErrors(error.response.data.errors);
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
  },
};
</script>

<style scoped>
.invalid-feedback {
  display: block;
}
</style>
