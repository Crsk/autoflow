import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getConnections } from '@/automation-engine/utils'
import { AddNodePayload, UpdateNodePayload, UpdateConnectionsPayload, State } from '../types'

const initialState: State = {
  nodesById: {},
  connections: [],
}

const createChild = (state: any, parentId: string | null, childId: string, x: number, y: number) => {
  const parent = parentId ? state.nodesById[parentId] : null
  parent?.childrenIds.push(childId)
  state.nodesById[childId] = { id: childId, x, y, childrenIds: [] }
}

const nodeSlice = createSlice({
  name: 'node',
  initialState,
  reducers: {

    addNode: (state, { payload: { parentId, id, x, y } }: PayloadAction<AddNodePayload>) => {
      createChild(state, parentId, id, x, y)
    },
    updateNode: (state, { payload: { id, x, y } }: PayloadAction<UpdateNodePayload>) => {
      state.nodesById[id] = { ...state.nodesById[id], x, y }
    },
    updateConnections: (state, { payload: { nodes, snapToGrid = false } }: PayloadAction<UpdateConnectionsPayload>) => {
      state.connections = getConnections(nodes, snapToGrid)
    },
    deleteNode: (state, { payload: { id } }: PayloadAction<{ id: string }>) => {
      const node = state.nodesById[id]
      if (node) {
        // Remove the deleting nodeId from each parent
        const parentNodes = Object.values(state.nodesById).filter((n) => n.childrenIds.includes(id))
        parentNodes.forEach((parent) => {
          parent.childrenIds = parent.childrenIds.filter((childId) => childId !== id)
        })

        // Remove the node
        delete state.nodesById[id]

        // Rebuild all the connections according to the remaining nodes
        state.connections = getConnections(Object.values(state.nodesById), true)
      }
    },
  },
})

export const { addNode, updateNode, updateConnections, deleteNode } = nodeSlice.actions
export default nodeSlice