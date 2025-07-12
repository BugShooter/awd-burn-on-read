import type { UUID } from 'node:crypto'
import { access, constants, readFile, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'

export function getNotePath(uuid: UUID): string {
    return path.join(process.cwd(), 'data', `${uuid}.txt`)
}
export async function isNoteExist(uuid: UUID): Promise<boolean> {
    try {
        await access(getNotePath(uuid), constants.F_OK)
        console.log('Note exist')
        return true
    } catch (error) {
        return false
    }
}
export async function getNote(uuid: UUID): Promise<string> {
    return readFile(getNotePath(uuid), 'utf-8')
}
export async function deleteNote(uuid: UUID): Promise<void> {
    return unlink(getNotePath(uuid))
}
export async function createNote(uuid: UUID, data: string): Promise<void> {
    try {
        await writeFile(getNotePath(uuid), data)
        console.log('File created')
    } catch (err) {
        console.error(err)
    }
}
