document.addEventListener("DOMContentLoaded", async function () {
  console.log("Script is running");

  let sortField = "createdAt";
  let sortOrder = "desc";
  let currentPage = 1;
  let totalPages = 1;
  const limit = 10; // Claims per page

  function updateSortIndicators() {
    document.querySelectorAll(".sort-header").forEach((header) => {
      header.classList.remove("sort-asc", "sort-desc");
      if (header.dataset.field === sortField) {
        header.classList.add(sortOrder === "asc" ? "sort-asc" : "sort-desc");
      }
    });
  }

  async function loadClaims(page = currentPage) {
    console.log("Loading claims for page:", page);
    try {
      const response = await fetch(
        `/users/claims?page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`
      );
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const text = await response.text();
      console.log("Response text:", text);

      const data = JSON.parse(text);
      if (data.claims && data.claims.length > 0) {
        totalPages = data.totalPages;
        // Adjust currentPage if it's greater than totalPages
        currentPage = Math.min(page, totalPages);
        await renderClaims(data.claims);
        updatePaginationControls();
      } else {
        console.log("No claims to display");
        currentPage = 1;
        totalPages = 1;
        const claimsTableBody = document.getElementById("claimsTableBody");
        if (claimsTableBody) {
          claimsTableBody.innerHTML =
            "<tr><td colspan='5'>No claims found</td></tr>";
        }
        updatePaginationControls();
      }
    } catch (error) {
      console.error("Error loading claims:", error);
    }
  }

  async function renderClaims(claims) {
    try {
      console.log("Rendering claims:", JSON.stringify(claims, null, 2));
      const response = await fetch("/users/render-claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ claims }),
      });
      console.log("Render response status:", response.status);
      const text = await response.text();
      console.log("Render response text:", text);

      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = JSON.parse(text);
          errorMessage =
            errorData.details || errorData.error || "Unknown error";
        } catch (e) {
          errorMessage = `Server returned HTML instead of JSON. Status: ${response.status}`;
        }
        throw new Error(
          `HTTP error! status: ${response.status}, details: ${errorMessage}`
        );
      }

      const claimsTableBody = document.getElementById("claimsTableBody");
      if (claimsTableBody) {
        claimsTableBody.innerHTML = text;
      } else {
        console.error("Claims table body not found");
      }
    } catch (error) {
      console.error("Error rendering claims:", error);
    }
  }

  function updatePaginationControls() {
    console.log(
      "Updating pagination controls. Current page:",
      currentPage,
      "Total pages:",
      totalPages
    );
    const paginationElement = document.getElementById("pagination");

    // If there's only one page, don't show any pagination controls
    if (totalPages <= 1) {
      paginationElement.innerHTML = "<span>Page 1 of 1</span>";
      return;
    }

    let paginationHTML = "";

    // Only show "Previous" button if we're not on the first page
    if (currentPage > 1) {
      paginationHTML += `<button onclick="window.loadClaims(${
        currentPage - 1
      })">Previous</button>`;
    }

    paginationHTML += `<span>Page ${currentPage} of ${totalPages}</span>`;

    // Only show "Next" button if we're not on the last page
    if (currentPage < totalPages) {
      paginationHTML += `<button onclick="window.loadClaims(${
        currentPage + 1
      })">Next</button>`;
    }

    paginationElement.innerHTML = paginationHTML;
  }

  document.querySelectorAll(".sort-header").forEach((header) => {
    console.log("Adding click listener to:", header.textContent.trim());
    header.addEventListener("click", async () => {
      console.log("Header clicked:", header.dataset.field);
      const field = header.dataset.field;
      if (sortField === field) {
        sortOrder = sortOrder === "asc" ? "desc" : "asc";
      } else {
        sortField = field;
        sortOrder = "asc";
      }
      updateSortIndicators();
      await loadClaims(currentPage); // Keep the current page when sorting
    });
  });

  // Initialize sort indicators
  updateSortIndicators();

  // Load initial claims
  await loadClaims(currentPage);

  console.log("Script finished loading");

  // Make loadClaims globally accessible
  window.loadClaims = loadClaims;
});
