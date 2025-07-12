import express from 'express'
import nunjucks from 'nunjucks'
import type { Request, Response, NextFunction } from 'express'
import { randomUUID } from 'node:crypto'
import type { UUID } from 'node:crypto'
import { isNoteExist, getNote, createNote, deleteNote } from './note.ts'

const port = process.env.PORT || 3000
const app = express()

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

nunjucks.configure('src/templates', {
    autoescape: true,
    express: app
})

app.get('/', (req: Request, res: Response) => {
    res.render('index.html', {
        title: 'Welcome to the Burn on Read Challenge!',
        content: 'Enter your secret message below and it will be burned after reading.'
    })
})

function createNoteValidator(req: Request, res: Response, next: NextFunction) {
    if (!req.body || !req.body.note) {
        res.status(400).render('notification.html', {
            title: '404',
            content: 'Note not found'
        })
        return
    }
    next()
}

app.post('/', createNoteValidator, async (req: Request, res: Response, next: NextFunction) => {
    console.log('POST note:', req.body.note)
    const note = req.body.note
    let noteId: UUID
    do {
        noteId = randomUUID()
    } while (await isNoteExist(noteId))
    console.log(`Generated note ID: ${noteId}`)
    createNote(noteId, note)
    res.status(200).render('notification.html', {
        title: `Congratulations!`,
        content: `The note with ID (${noteId}) was successfully created.`
    })
})

function getNoteValidator(req: Request, res: Response, next: NextFunction) {
    //TODO: validate noteID. It must be UUID
    if (!req.body || !req.body.noteId) {
        res.status(400).render('notification.html', {
            title: '400',
            content: 'Bad request'
        })
        return
    }
    next()
}
app.post('/note', getNoteValidator, async (req: Request, res: Response, next: NextFunction) => {
    const noteId = req.body.noteId as UUID
    const exist = await isNoteExist(noteId)

    if (!exist) {
        console.log('Note not found')
        res.status(404).render('notification.html', {
            title: '404',
            content: 'Note not found'
        })
        return
    }
    const note = await getNote(noteId)

    await deleteNote(noteId)
    console.log(`Note ID(${noteId}) is removed`)
    console.log(`Note: ${note}`)

    res.render('note.html', { note })
})

app.listen(port, () => {
    console.log(`Burn on Read is running on http://localhost:${port}`)
})
