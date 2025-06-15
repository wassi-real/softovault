import { writable } from "svelte/store"

function createToastStore() {
  const { subscribe, set } = writable({ message: "", type: "info" })

  return {
    subscribe,
    show: (message, type = "info") => set({ message, type }),
    clear: () => set({ message: "", type: "info" }),
  }
}

export const toastStore = createToastStore()
