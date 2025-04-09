"use strict";

function generateWallet() {
  try {
    const keypair = solanaWeb3.Keypair.generate(); // Generate Keypair

    const publicKey = keypair.publicKey.toBase58(); // Public Key in Base58
    const privateKey = Array.from(keypair.secretKey).join(", "); // Add space after commas

    document.getElementById("publicKey").innerText = publicKey;
    document.getElementById("privateKey").innerText = privateKey;

    // Generate QR codes for public and private keys
    QRCode.toCanvas(
      document.getElementById("publicKeyQR"),
      publicKey,
      {
        width: 150,
        height: 150,
      },
      function (error) {
        if (error) console.error(error);
        console.log("Public key QR code generated!");
      }
    );

    // QRCode.toCanvas(
    //   document.getElementById("privateKeyQR"),
    //   privateKey,
    //   {
    //     width: 200,
    //     height: 200,
    //   },
    //   function (error) {
    //     if (error) console.error(error);
    //     console.log("Private key QR code generated!");
    //   }
    // );
  } catch (error) {
    console.error("Error generating wallet:", error);
    alert("Failed to generate wallet. Check the console for errors.");
  }
  ////////////////////////////////////////////////////////////////////
  // code to display wallet--details after genrate wallet has been clicked

  // Always show the wallet details after generation
  const walletDetails = document.getElementById("walletDetails");
  walletDetails.style.display = "block";
  // Animate wallet details

  // Force reflow to reset animation
  void walletDetails.offsetWidth;

  // Add visible class with animation
  walletDetails.classList.add("visible");
}

////////////////////////////////////////////////////////////////////
// javascript code to get current year
const yearEl = document.querySelector(".year");
const currentYear = new Date().getFullYear();
console.log(currentYear);
yearEl.textContent = currentYear;

////////////////////////////////////////////////////////////////////
// javascript code to copy to clipbaord
function copyAddress() {
  const addressEl = document.querySelector(".publicaddress");
  const addressText = addressEl.innerText;

  navigator.clipboard
    .writeText(addressText)
    .then(() => {
      showToast("Copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy address: ", err);
      showToast("Failed to copy 😢");
    });
}
function copyPrivate() {
  const privateEl = document.querySelector(".private--key");
  const privateText = privateEl.innerText;

  navigator.clipboard
    .writeText(privateText)
    .then(() => {
      showToast("Copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy address: ", err);
      showToast("Failed to copy 😢");
    });
}

////////////////////////////////////////////////////////////////////
// javascript code to show toast message when the copy btn is clicked

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast show";

  setTimeout(() => {
    toast.className = "toast";
  }, 3000);
}

////////////////////////////////////////////////////////////////////
// print wallet

function printWallet() {
  // Check if wallet exists
  const publicKey = document.getElementById("publicKey").textContent.trim();

  if (!publicKey) {
    showToast("Please generate a wallet before printing", true);
    return; // Stop execution here
  }

  // Original print logic (unchanged)
  const printContents = document.querySelector(".walletContainer").innerHTML;
  const win = window.open("", "", "width=800,height=600");

  win.document.write(`
    <html>
      <head>
        <title>Print Wallet</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .no-print { display: none !important; }
        </style>
      </head>
      <body>
        ${printContents}
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          }
        <\/script>
      </body>
    </html>
  `);
  win.document.close();
}

// Updated showToast() function
function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast no-print"; // Reset classes

  if (isError) {
    toast.classList.add("error");
  }

  // Force reflow for animation
  void toast.offsetWidth;

  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
////////////////////////////////////////////////////////////////////
//private jkey hidden
// In generateWallet() function:
const privateKeyElement = document.getElementById("privateKey");
privateKeyElement.textContent = privateKey;
privateKeyElement.classList.remove("revealed"); // Start blurred

// Updated toggle function:
function togglePrivateKey() {
  const keyElement = document.getElementById("privateKey");
  const btn = document.querySelector(".btn--view");

  keyElement.classList.toggle("revealed");

  // Update button text based on revealed state
  if (keyElement.classList.contains("revealed")) {
    btn.textContent = "Hide Private Key";
    btn.classList.add("warning");
  } else {
    btn.textContent = "View Private Key";
    btn.classList.remove("warning");
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// js code to fecth crypto data
fetch("http://127.0.0.1:5000/crypto-data")
  .then((res) => res.json())
  .then((data) => {
    // Loop through each coin's data
    Object.keys(data).forEach((crypto) => {
      const priceData = data[crypto];

      // Helper function to format large numbers
      const formatLargeNumber = (num) => {
        if (num >= 1e9) return (num / 1e9).toFixed(2) + " billion";
        if (num >= 1e6) return (num / 1e6).toFixed(2) + " million";
        return num.toLocaleString(); // Simple formatting for smaller numbers
      };

      // Update Price
      document
        .querySelectorAll(`[class~="${crypto}-price"]`)
        .forEach((priceElement) => {
          if (priceData["price"] !== undefined) {
            priceElement.innerText = `$${priceData["price"].toLocaleString()}`;
          }
        });

      // Update 24h Change (for percentage)
      document
        .querySelectorAll(`[class~="${crypto}-change"]`)
        .forEach((changeElement) => {
          const change = parseFloat(priceData["24h_change"]).toFixed(2); // Change this line
          changeElement.innerText = `${change}%`;
          changeElement.classList.remove("cc-red", "cc-green");
          changeElement.classList.add(
            parseFloat(change) < 0 ? "cc-red" : "cc-green"
          );
        });

      // Update 24h Volume
      document
        .querySelectorAll(`[class~="${crypto}-volume"]`)
        .forEach((volumeElement) => {
          if (priceData["24h_volume"] !== undefined) {
            volumeElement.innerText = `$${priceData[
              "24h_volume"
            ].toLocaleString()}`;
          }
        });

      // Update Market Cap (formatted as billions or millions)
      document
        .querySelectorAll(`[class~="${crypto}-marketcap"]`)
        .forEach((marketCapElement) => {
          if (priceData["market_cap"] !== undefined) {
            marketCapElement.innerText = `$${formatLargeNumber(
              priceData["market_cap"]
            )}`;
          }
        });

      // Update Fully Diluted Market Cap (formatted as billions or millions)
      document
        .querySelectorAll(`[class~="${crypto}-fd-marketcap"]`)
        .forEach((fdMarketCapElement) => {
          if (priceData["usd_fully_diluted_market_cap"] !== undefined) {
            fdMarketCapElement.innerText = `Fully Diluted Market Cap: $${formatLargeNumber(
              priceData["usd_fully_diluted_market_cap"]
            )}`;
          }
        });

      // Update Circulating Supply (formatted as millions or billions)
      document
        .querySelectorAll(`[class~="${crypto}-circulating"]`)
        .forEach((circulatingElement) => {
          if (priceData["circulating_supply"] !== undefined) {
            circulatingElement.innerText = ` ${formatLargeNumber(
              priceData["circulating_supply"]
            )}`;
          }
        });

      // Update Total Supply (formatted as millions or billions)
      document
        .querySelectorAll(`[class~="${crypto}-supply"]`)
        .forEach((supplyElement) => {
          if (priceData["total_supply"] !== undefined) {
            supplyElement.innerText = ` ${formatLargeNumber(
              priceData["total_supply"]
            )}`;
          }
        });

      // Update All Time High (ATH)
      document
        .querySelectorAll(`[class~="${crypto}-ath"]`)
        .forEach((athElement) => {
          if (priceData["ath"] !== undefined) {
            athElement.innerText = ` $${priceData["ath"].toLocaleString()}`;
          }
        });

      // Update All Time Low (ATL)
      document
        .querySelectorAll(`[class~="${crypto}-atl"]`)
        .forEach((atlElement) => {
          if (priceData["atl"] !== undefined) {
            atlElement.innerText = `$${priceData["atl"].toLocaleString()}`;
          }
        });

      // Update Market Dominance with % symbol
      document
        .querySelectorAll(`[class~="${crypto}-dominance"]`)
        .forEach((dominanceElement) => {
          if (priceData["market_dominance"] !== undefined) {
            dominanceElement.innerText = `${priceData["market_dominance"]}%`;
          }
        });

      // Update Market Rank
      document
        .querySelectorAll(`[class~="${crypto}-rank"]`)
        .forEach((rankElement) => {
          if (priceData["market_rank"] !== undefined) {
            rankElement.innerText = `#${priceData["market_rank"]}`;
          }
        });
    });
  })
  .catch((err) => console.error(err));
