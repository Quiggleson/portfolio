import { Instance } from "./Instance";

const instanceMap = new Map<string, Instance>()

export function getOrCreateInstance(sessionId: string): Instance {
    if (!instanceMap.has(sessionId)) {
        instanceMap.set(sessionId, new Instance())
    }
    return instanceMap.get(sessionId)!
}

export function deleteInstance(sessionId: string) {
    instanceMap.delete(sessionId)
}