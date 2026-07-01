import express from "express";
import { Webhook } from "svix";
import User from "../../models/User.model.js";

const router = express.Router();

router.post(
  "/webhooks/clerk",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("========== CLERK WEBHOOK ==========");

    try {
      const webhookSecret =
        process.env.CLERK_WEBHOOK_SECRET ||
        process.env.CLERK_WEBHOOK_SIGNING_SECRET;

      if (!webhookSecret) {
        console.error("Missing webhook secret");
        return res
          .status(500)
          .json({ error: "Missing Clerk webhook signing secret" });
      }

      const svixId = req.headers["svix-id"];
      const svixTimestamp = req.headers["svix-timestamp"];
      const svixSignature = req.headers["svix-signature"];

      if (!svixId || !svixTimestamp || !svixSignature) {
        console.error("Missing Svix headers");
        return res.status(400).json({ error: "Missing svix headers" });
      }

      console.log("Step 1: Headers received");

      const webhook = new Webhook(webhookSecret);

      console.log("Step 2: Verifying signature...");

      const payload = webhook.verify(req.body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      });

      console.log("Step 3: Signature verified");

      const { type, data } = payload;
      console.log("Webhook event:", type, "Clerk user ID:", data.id);

      console.log("Webhook type:", type);

      const email = data.email_addresses?.[0]?.email_address;
      const firstName =
        data.first_name ||
        data.username ||
        email?.split("@")[0] ||
        "Clerk";
      const lastName = data.last_name || "User";
      const role =
        data.public_metadata?.role === "client" ? "client" : "student";

      if (!email && type !== "user.deleted") {
        return res
          .status(400)
          .json({ error: "Clerk user is missing an email address" });
      }

      if (type === "user.created") {
        console.log("Step 4: Creating user");

        await User.findOneAndUpdate(
          { clerkId: data.id },
          {
            clerkId: data.id,
            email,
            firstName,
            lastName,
            role,
          },
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          }
        );

        console.log("Step 5: User created");
      }

      if (type === "user.updated") {
        console.log("Step 4: Updating user");

        await User.findOneAndUpdate(
          { clerkId: data.id },
          {
            email,
            firstName,
            lastName,
            role,
          },
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          }
        );

        console.log("Step 5: User updated");
      }

      if (type === "user.deleted") {
        console.log("Step 4: Deleting user");

        await User.findOneAndDelete({
          clerkId: data.id,
        });

        console.log("Step 5: User deleted");
      }

      console.log("Step 6: Sending 200");
      return res.status(200).json({ received: true });
    } catch (err) {
      console.error("WEBHOOK ERROR:");
      console.error(err);

      return res.status(500).json({
        error: err.message,
      });
    }
  }
);

export default router;
