document.addEventListener("DOMContentLoaded", () => {
  // Travel form elements
  const travelForm = document.getElementById("travelForm");
  const fullNameInput = document.getElementById("fullName");
  const phoneNumberInput = document.getElementById("phoneNumber");
  const destinationSelect = document.getElementById("destination");
  const travelTypeSelect = document.getElementById("travelType");
  const packageSelect = document.getElementById("package");
  const totalParticipantsInput = document.getElementById("totalParticipants");
  const departureDateInput = document.getElementById("departureDate");
  const returnDateInput = document.getElementById("returnDate");
  const totalPriceDisplay = document.getElementById("totalPrice");
  const formMessage = document.getElementById("formMessage");

  // Package prices data
  const packagePrices = {
    Dubai: {
      Penerbangan: {
        Ekonomi: 1200000,
        Bisnis: 3000000,
        Premium: 5000000,
        Elite: 8000000,
        VIP: 12000000,
      },
      Kapal: {
        Ekonomi: 800000,
        Bisnis: 2000000,
        Premium: 3500000,
        Elite: 6000000,
        VIP: 9000000,
      },
    },
    Paris: {
      Penerbangan: {
        Ekonomi: 1500000,
        Bisnis: 3500000,
        Premium: 5500000,
        Elite: 8500000,
        VIP: 12500000,
      },
      Kapal: {
        Ekonomi: 900000,
        Bisnis: 2100000,
        Premium: 3600000,
        Elite: 6100000,
        VIP: 9100000,
      },
    },
    Santorini: {
      Penerbangan: {
        Ekonomi: 1400000,
        Bisnis: 3200000,
        Premium: 5200000,
        Elite: 8200000,
        VIP: 12200000,
      },
      Kapal: {
        Ekonomi: 850000,
        Bisnis: 2050000,
        Premium: 3550000,
        Elite: 6050000,
        VIP: 9050000,
      },
    },
    Tokyo: {
      Penerbangan: {
        Ekonomi: 1300000,
        Bisnis: 3100000,
        Premium: 5100000,
        Elite: 8100000,
        VIP: 12100000,
      },
      Kapal: {
        Ekonomi: 830000,
        Bisnis: 2030000,
        Premium: 3530000,
        Elite: 6030000,
        VIP: 9030000,
      },
    },
    Mekah: {
      Penerbangan: {
        Ekonomi: 1100000,
        Bisnis: 2900000,
        Premium: 4900000,
        Elite: 7900000,
        VIP: 11900000,
      },
      Kapal: {
        Ekonomi: 800000,
        Bisnis: 2000000,
        Premium: 3500000,
        Elite: 6000000,
        VIP: 9000000,
      },
    },
    Bali: {
      Penerbangan: {
        Ekonomi: 1000000,
        Bisnis: 2800000,
        Premium: 4800000,
        Elite: 7800000,
        VIP: 11800000,
      },
      Kapal: {
        Ekonomi: 750000,
        Bisnis: 1950000,
        Premium: 3450000,
        Elite: 5950000,
        VIP: 8950000,
      },
    },
    "New York": {
      Penerbangan: {
        Ekonomi: 1600000,
        Bisnis: 3600000,
        Premium: 5600000,
        Elite: 8600000,
        VIP: 12600000,
      },
      Kapal: {
        Ekonomi: 950000,
        Bisnis: 2150000,
        Premium: 3650000,
        Elite: 6150000,
        VIP: 9150000,
      },
    },
    London: {
      Penerbangan: {
        Ekonomi: 1500000,
        Bisnis: 3500000,
        Premium: 5500000,
        Elite: 8500000,
        VIP: 12500000,
      },
      Kapal: {
        Ekonomi: 900000,
        Bisnis: 2100000,
        Premium: 3600000,
        Elite: 6100000,
        VIP: 9100000,
      },
    },
    Sydney: {
      Penerbangan: {
        Ekonomi: 1400000,
        Bisnis: 3400000,
        Premium: 5400000,
        Elite: 8400000,
        VIP: 12400000,
      },
      Kapal: {
        Ekonomi: 880000,
        Bisnis: 2080000,
        Premium: 3580000,
        Elite: 6080000,
        VIP: 9080000,
      },
    },
    "Cape Town": {
      Penerbangan: {
        Ekonomi: 1300000,
        Bisnis: 3300000,
        Premium: 5300000,
        Elite: 8300000,
        VIP: 12300000,
      },
      Kapal: {
        Ekonomi: 860000,
        Bisnis: 2060000,
        Premium: 3560000,
        Elite: 6060000,
        VIP: 9060000,
      },
    },
  };

  // Format number to Indonesian Rupiah currency string
  function formatCurrency(amount) {
    return "Rp " + amount.toLocaleString("id-ID");
  }

  // Validate phone number: only digits allowed
  function isValidPhoneNumber(phone) {
    // Validasi: hanya digit, minimal 8 digit, maksimal 15 digit
    return /^\d{8,15}$/.test(phone);
  }

  // Clear all error messages and form message
  function clearErrors() {
    document
      .querySelectorAll(".error-message")
      .forEach((el) => (el.textContent = ""));
    formMessage.textContent = "";
  }

  // Show error message for a specific input
  function showError(inputId, message) {
    const errorEl = document.getElementById("error-" + inputId);
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  // Validation functions for each field
  function validateFullName() {
    if (!fullNameInput.value.trim()) {
      showError("fullName", "Nama lengkap harus diisi.");
      return false;
    }
    return true;
  }

  function validatePhoneNumber() {
    const phone = phoneNumberInput.value.trim();
    if (!phone) {
      showError("phoneNumber", "Nomor telepon harus diisi.");
      return false;
    } else if (!isValidPhoneNumber(phone)) {
      showError("phoneNumber", "Nomor telepon harus berupa 8-15 digit angka.");
      return false;
    }
    return true;
  }

  function validateDestination() {
    if (!destinationSelect.value) {
      showError("destination", "Destinasi harus dipilih.");
      return false;
    }
    return true;
  }

  function validateTravelType() {
    if (!travelTypeSelect.value) {
      showError("travelType", "Jenis perjalanan harus dipilih.");
      return false;
    }
    return true;
  }

  function validatePackage() {
    if (!packageSelect.value) {
      showError("package", "Paket harus dipilih.");
      return false;
    }
    return true;
  }

  function validateTotalParticipants() {
    const val = totalParticipantsInput.value;
    if (!val || parseInt(val, 10) < 1) {
      showError("totalParticipants", "Jumlah peserta harus minimal 1.");
      return false;
    }
    return true;
  }

  function validateDepartureDate() {
    if (!departureDateInput.value) {
      showError("departureDate", "Tanggal keberangkatan harus diisi.");
      return false;
    }
    return true;
  }

  function validateReturnDate() {
    if (!returnDateInput.value) {
      showError("returnDate", "Tanggal kembali harus diisi.");
      return false;
    } else if (
      departureDateInput.value &&
      returnDateInput.value < departureDateInput.value
    ) {
      showError(
        "returnDate",
        "Tanggal kembali harus setelah tanggal keberangkatan."
      );
      return false;
    }
    return true;
  }

  // Main form validation function
  function validateForm() {
    clearErrors();
    let valid = true;
    if (!validateFullName()) valid = false;
    if (!validatePhoneNumber()) valid = false;
    if (!validateDestination()) valid = false;
    if (!validateTravelType()) valid = false;
    if (!validatePackage()) valid = false;
    if (!validateTotalParticipants()) valid = false;
    if (!validateDepartureDate()) valid = false;
    if (!validateReturnDate()) valid = false;
    return valid;
  }

  // Calculate total price based on selections and participants
  function calculateTotalPrice() {
    const destination = destinationSelect.value;
    const travelType = travelTypeSelect.value;
    const packageType = packageSelect.value;
    const participants = parseInt(totalParticipantsInput.value, 10);

    if (
      destination &&
      travelType &&
      packageType &&
      participants &&
      !isNaN(participants) &&
      participants > 0
    ) {
      const basePrice = packagePrices[destination]?.[packageType]?.[travelType];
      if (basePrice !== undefined) {
        return basePrice * participants;
      }
    }
    return 0;
  }

  // Update total price display
  function updateTotalPriceDisplay() {
    const total = calculateTotalPrice();
    totalPriceDisplay.textContent = formatCurrency(total);
  }

  // Form submit event handler
  travelForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateForm()) {
      const totalPrice = calculateTotalPrice();
      formMessage.style.color = "green";
      formMessage.textContent = `Pesanan berhasil! Total harga: ${formatCurrency(
        totalPrice
      )}`;
      travelForm.reset();
      totalPriceDisplay.textContent = "Rp 0";
    } else {
      formMessage.style.color = "red";
      formMessage.textContent = "Harap perbaiki kesalahan pada formulir.";
    }
  });

  // Update total price when relevant inputs change
  [
    destinationSelect,
    travelTypeSelect,
    packageSelect,
    totalParticipantsInput,
  ].forEach((el) => {
    el.addEventListener("change", updateTotalPriceDisplay);
    el.addEventListener("input", updateTotalPriceDisplay);
  });
});
