import { Request } from 'express'
import { CreateNodeBody, UpdateNodeBody, DeleteNodePayload, TypedResponse, StatusCode, UpdateNodeParams } from 'shared/src/types/dto'
import { Node } from 'shared/src/types/models'
import NodeService from '../services/node.service'
import { SnakeCase } from '../utils/types'

class NodeController {
  public static async getNodes(_req: Request, res: TypedResponse<SnakeCase<Node>[]>): Promise<TypedResponse<SnakeCase<Node>[]>> {
    const nodes = await NodeService.getNodes()
    if (!nodes?.length) return res.status(StatusCode.NOT_FOUND).json({ message: 'Nodes not found', success: false })

    return res.status(StatusCode.OK).json({ message: 'Success', payload: nodes, success: true })
  }

  public static async getNode(req: Request<{ id: string }>, res: TypedResponse): Promise<TypedResponse<Node>> {
    const { id } = req.params
    if (!id) return res.status(StatusCode.BAD_REQUEST).json({ message: 'Bad Request: Missing required fields', success: false })

    const node = await NodeService.getNode(id)
    if (!node) return res.status(StatusCode.NOT_FOUND).json({ message: 'Node not found', success: false })

    return res.status(StatusCode.OK).json({ message: 'Success', payload: node, success: true })
  }

  public static async createNode(req: Request<{}, {}, SnakeCase<CreateNodeBody>>, res: TypedResponse<SnakeCase<Node>>): Promise<TypedResponse<SnakeCase<Node>>> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { id, name = '', x, y, parent_id } = req.body
    const newNode: SnakeCase<CreateNodeBody> = { id, name, x, y, parent_id }
    if (!id || !x || !y || !parent_id) return res.status(StatusCode.BAD_REQUEST).json({ message: 'Bad Request: Missing required fields', success: false })
    const createdNode = await NodeService.createNode(newNode)

    return res.status(StatusCode.CREATED).json({ message: `Node id ${id} was created`, payload: createdNode, success: true })
  }

  public static async updateNode(req: Request<UpdateNodeParams, {}, Partial<Omit<Node, 'id'>>>, res: TypedResponse): Promise<TypedResponse> {
    const { id } = req.params
    const updatedNode = req.body
    if (!id || !updatedNode) return res.status(StatusCode.BAD_REQUEST).json({ message: 'Bad Request: Missing required fields', success: false })
    if ((updatedNode as any).id) delete (updatedNode as any).id // remove id just in case, we don't want it to be updated
    if (!await NodeService.getNode(id)) return res.status(StatusCode.NOT_FOUND).json({ message: 'Node not found', success: false })

    const node = await NodeService.updateNode(id, updatedNode)

    return res.status(StatusCode.OK).json({ message: `Node ${id} updated successfully`, payload: node, success: true })
  }

  public static async deleteNode(req: Request<{ id: string }>, res: TypedResponse<{ message: string }>): Promise<TypedResponse<{ message: string }>> {
    const { id } = req.params
    if (!id) return res.status(StatusCode.BAD_REQUEST).json({ message: 'Bad Request: Missing required fields', success: false })
    if (!await NodeService.getNode(id)) return res.status(StatusCode.NOT_FOUND).json({ message: 'Node not found', success: false })

    await NodeService.deleteNode(id)

    return res.status(StatusCode.OK).json({ message: 'Node deleted successfully', success: true })
  }

  public static async bulkCreate(req: Request<{}, {}, SnakeCase<CreateNodeBody>[]>, res: TypedResponse): Promise<TypedResponse> {
    const nodesToInsert = req.body
    if (!nodesToInsert.length || nodesToInsert.some((node) => !node.id || !node.x || !node.y || !node.parent_id)) return res.status(StatusCode.BAD_REQUEST).json({ message: 'Bad Request: Missing required fields', success: false })

    const resultLength = await NodeService.bulkCreate(nodesToInsert)

    return res.status(StatusCode.CREATED).json({ message: `${resultLength} Nodes created successfully`, success: true })
  }

  public static async bulkUpdate(req: Request<{}, {}, SnakeCase<Partial<UpdateNodeBody>>[]>, res: TypedResponse): Promise<TypedResponse> {
    const updatePayloads = req.body
    if (!updatePayloads.length || updatePayloads.some((node) => !node.id)) return res.status(StatusCode.BAD_REQUEST).json({ message: 'Bad Request: Missing required fields', success: false })

    const resultLength = await NodeService.bulkUpdate(updatePayloads)

    return res.status(StatusCode.OK).json({ message: `${resultLength} Nodes updated successfully`, success: true })
  }

  public static async bulkDelete(req: Request<{}, {}, SnakeCase<DeleteNodePayload>[]>, res: TypedResponse): Promise<TypedResponse> {
    const payloads = req.body
    if (!payloads?.length) return res.status(StatusCode.BAD_REQUEST).json({ message: 'Bad Request: Missing required fields', success: false })

    const idsToDelete = payloads.map((payload) => payload.id)
    const resultLength = await NodeService.bulkDelete(idsToDelete)

    return res.status(StatusCode.OK).json({ message: `${resultLength} Nodes deleted successfully`, success: true })
  }
}

export default NodeController
