<template>
  <div>
    <!-- Button to open the modal -->
    <button
      type="button"
      class="btn btn-danger"
      data-bs-toggle="modal"
      :data-bs-target="`#deleteTaskModal${task.id}`"
    >
      Delete Task
    </button>

    <!-- Modal -->
    <div
      class="modal fade"
      :id="`deleteTaskModal${task.id}`"
      tabindex="-1"
      aria-labelledby="modalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalLabel">Delete Task</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this task?</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button type="button" class="btn btn-danger" @click="deleteTask">
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
import axios from "axios";

export default {
  name: "DeleteTaskComponent",
  props: {
    task: Object, // Expecting task object as a prop
  },
  data() {
    return {
      localTask: { ...this.task }, // Create a local copy of the task prop
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
    async deleteTask() {
      try {
        await axios.delete(
          `http://localhost:8000/api/tasks/destroy/${this.localTask.id}`
        );
        this.$emit("taskUpdated");
        // Close modal using Bootstrap's modal method
        const modalElement = document.getElementById(
          `deleteTaskModal${this.localTask.id}`
        );
        const modalInstance = Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        } else {
          new Modal(modalElement).hide();
        }
      } catch (error) {
        console.error("Error deleting task:", error);
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
