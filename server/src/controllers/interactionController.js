const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const dns = require('dns');

exports.sendComplaint = async (req, res) => {
  try {
    const { contractCode, roomId, bedId, contactName, contactPhone, email, message } = req.body;

    const targetContractCode = parseInt(contractCode, 10);
    const targetRoomId = parseInt(roomId, 10);
    const targetBedId = parseInt(bedId, 10);

    if (isNaN(targetContractCode) || isNaN(targetRoomId) || isNaN(targetBedId)) {
      return res.status(400).json({ error: "Contract Code, Room ID, and Bed ID must be valid numbers." });
    }

    // Verify if these specific entities exist and are properly related
    const contractVerification = await prisma.chiTietHopDongThue.findFirst({
      where: {
        idHopDong: targetContractCode,
        idGiuong: targetBedId,
        giuong: {
          idPhong: targetRoomId
        }
      }
    });

    if (!contractVerification) {
      return res.status(404).json({ error: "The provided contract code, room ID, or bed ID do not match or exist." });
    }

    // Validation passed perfectly. Note: no data is saved to DB per task requirements.
    return res.status(200).json({ message: "Validation passed perfectly." });
  } catch (error) {
    console.error("sendComplaint error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: "Invalid email structure." });
    }

    const domain = email.split('@')[1];

    try {
      const records = await dns.promises.resolveMx(domain);
      if (records && records.length > 0) {
        return res.status(200).json({ message: "Email domain is valid and can receive mail." });
      } else {
        return res.status(400).json({ error: "Email domain does not exist or cannot receive mail." });
      }
    } catch (dnsError) {
      return res.status(400).json({ error: "Email domain does not exist or cannot receive mail." });
    }
  } catch (error) {
    console.error("verifyEmail error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
