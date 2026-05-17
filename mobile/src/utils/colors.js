const postColors = [
    {
      background: "#fff7ef",
      border: "#ffd6ad",
    },
    {
      background: "#eff6ff",
      border: "#bfdbfe",
    },
    {
      background: "#f0fdf4",
      border: "#bbf7d0",
    },
    {
      background: "#fefce8",
      border: "#fde68a",
    },
    {
      background: "#faf5ff",
      border: "#e9d5ff",
    },
  ]
  
  export function getPostColor(seed = "") {
    const value = String(seed)
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0)
  
    return postColors[value % postColors.length]
  }
  
  export function getRoleColor(role) {
    if (role === "professor") {
      return {
        background: "#eff6ff",
        border: "#2563eb",
        text: "#2563eb",
        solid: "#2563eb",
      }
    }
  
    return {
      background: "#fff7ef",
      border: "#ff7900",
      text: "#ff7900",
      solid: "#ff7900",
    }
  }