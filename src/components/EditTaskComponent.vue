<template>
  <div>
    <!-- Button to open the modal -->
    <button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="modal"
      :data-bs-target="`#editTaskModal${task.id}`"
    >
      Edit Task
    </button>

    <!-- Modal -->
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

              <!-- Start title -->
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
              <!-- End title -->

              <!-- Start Descriptions -->
              <div class="mb-3">
                <label for="description" class="form-label">Descriptions</label>
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
              <!-- End Descriptions -->

              <!-- Start status -->
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
              <!-- End status -->

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
import axios from "axios";

export default {
  name: "EditTaskComponent",
  props: {
    task: Object, // Expecting task object as a prop
  },
  data() {
    return {
      localTask: { ...this.task }, // Create a local copy of the task prop
      errors: {},
    };
  },
  watch: {
    task: {
      handler(newTask) {
        this.localTask = { ...newTask }; // Update local copy when the prop changes
      },
      deep: true,
    },
  },
  methods: {
    async submitForm() {
      try {
        await axios.put("http://localhost:8000/api/tasks/update", {
          id: this.localTask.id,
          title: this.localTask.title,
          description: this.localTask.description,
          status: this.localTask.status,
        });
        this.$emit("taskUpdated");

        // Close modal using Bootstrap's modal method
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
      // Flatten the errors object
      const flattenedErrors = {};
      for (const [field, messages] of Object.entries(errors)) {
        flattenedErrors[field] = messages.join(", "); // Combine all messages into a single string
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
