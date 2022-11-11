const ethers = require("ethers");
const crypto = require("crypto");

while (true) {
    const id = crypto.randomBytes(32).
    toString("hex");
    const privateKey = "0x" + id;
    console.log("Private key: ", privateKey);

    const wallet = new ethers.Wallet(privateKey);
    console.log("Address: " + wallet.address);
    if(wallet.address.startsWith("0x1998") && !("0" <= wallet.address[6] && wallet.address[6] <= "9")) {
        break;
    }
}
