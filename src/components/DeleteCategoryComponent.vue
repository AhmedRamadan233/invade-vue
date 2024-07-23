<template>
  <div>
    <button
      type="button"
      class="btn btn-danger"
      data-bs-toggle="modal"
      :data-bs-target="`#deleteCategoryModal${localCategory.id}`"
    >
      Delete Category
    </button>

    <div
      class="modal fade"
      :id="`deleteCategoryModal${localCategory.id}`"
      tabindex="-1"
      aria-labelledby="modalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalLabel">Delete Category</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this category?</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteCategory"
            >
              Delete
            </button>
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
  name: "DeleteCategoryComponent",
  props: {
    category: {
      type: Object,
      default: () => ({ id: null }),
    },
  },
  data() {
    return {
      localCategory: { ...this.category },
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
    async deleteCategory() {
      try {
        await axiosInstance.delete(
          `/categories/destroy/${this.localCategory.id}`
        );
        this.$emit("categoryUpdated");
        const modalElement = document.getElementById(
          `deleteCategoryModal${this.localCategory.id}`
        );
        const modalInstance = Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        } else {
          new Modal(modalElement).hide();
        }
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    },
  },
};
</script>

<style scoped>
.invalid-feedback {
  display: block;
}
</style>
