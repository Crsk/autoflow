import { Router } from 'express'
import { CreateNodeSchema, UpdateNodeBodySchema } from 'shared/src/types/schemas'
import NodeController from '../controllers/node.controller'
import { errorHandler } from '../utils/errorHandler'
import schemaValidator from '../middlewares/schemaValidator.middleware'

const router = Router()
const { getNodes, getNode, createNode, updateNode, deleteNode, bulkCreate, bulkUpdate, bulkDelete } = NodeController

router.get('/nodes', errorHandler(getNodes))
router.get('/nodes/:id', errorHandler(getNode))
router.post('/node', schemaValidator(CreateNodeSchema), errorHandler(createNode))
router.patch('/nodes/:id', schemaValidator(UpdateNodeBodySchema), errorHandler(updateNode))
router.delete('/nodes/:id', errorHandler(deleteNode))
router.post('/nodes/bulk-create', errorHandler(bulkCreate))
router.post('/nodes/bulk-update', errorHandler(bulkUpdate))
router.post('/nodes/bulk-delete', errorHandler(bulkDelete))

export default router
