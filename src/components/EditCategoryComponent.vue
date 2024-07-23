<template>
    <div>
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        :data-bs-target="`#editCategoryModal${localCategory.id}`"
      >
        Edit Category
      </button>
  
      <div
        class="modal fade"
        :id="`editCategoryModal${localCategory.id}`"
        tabindex="-1"
        aria-labelledby="modalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalLabel">Edit Category</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="submitForm">
                <!-- Hidden input for category ID -->
                <input type="hidden" v-model="localCategory.id" />
  
                <!-- Name -->
                <div class="mb-3">
                  <label for="name" class="form-label">Name</label>
                  <input
                    v-model="localCategory.name"
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
    name: "EditCategoryComponent",
    props: {
      category: {
        type: Object,
        default: () => ({ id: null, name: '' }),
      },
    },
    data() {
      return {
        localCategory: { ...this.category },
        errors: {},
      };
    },
    watch: {
      category: {
        handler(newCategory) {
          this.localCategory = { ...newCategory };
        },
        deep: true,
      },
    },
    methods: {
      async submitForm() {
        try {
          await axiosInstance.put("/categories/update", {
            id: this.localCategory.id,
            name: this.localCategory.name,
          });
          this.$emit("categoryUpdated");
          const modalElement = document.getElementById(
            `editCategoryModal${this.localCategory.id}`
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
  