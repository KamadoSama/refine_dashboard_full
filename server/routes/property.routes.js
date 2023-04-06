import express from 'express';
import { createProperty, deleteProperty,updateProperty,getPropertyDetail,getAllProperty} from '../controller/property.controller.js';

const router = express.Router();

router.route("/").post(createProperty);
router.route("/:id").delete(deleteProperty);
router.route("/:id").patch(updateProperty);
router.route("/").get(getAllProperty);
router.route("/:id").get(getPropertyDetail);

export default router;
