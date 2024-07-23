<template>
  <div>
    <button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#categoryModal"
    >
      Add New Category
    </button>

    <div
      class="modal fade"
      id="categoryModal"
      tabindex="-1"
      aria-labelledby="modalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalLabel">Add New Category</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input
                  v-model="category.name"
                  type="text"
                  id="name"
                  class="form-control"
                  placeholder="Enter category name"
                />
                <div v-if="errors.name" class="invalid-feedback">
                  {{ errors.name }}
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
  name: "AddCategoryComponent",
  data() {
    return {
      category: {
        name: "",
      },
      errors: {},
    };
  },
  methods: {
    async submitForm() {
      try {
        await axiosInstance.post(
          "http://localhost:8000/api/categories/store",
          this.category
        );
        this.resetForm();
        this.$emit("categoryAdded");

        const modalElement = document.getElementById("categoryModal");
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
      this.category.name = "";
      this.errors = {};
    },
  },
};
</script>

<style scoped></style>
