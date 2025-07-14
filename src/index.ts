import dotenv from 'dotenv'
dotenv.config({ path: ['.env.local', '.env'] })
import express from 'express'
import nunjucks from 'nunjucks'
import type { Request, Response, NextFunction } from 'express'
import { randomUUID } from 'node:crypto'
import type { UUID } from 'node:crypto'
import { isNoteExist, getNote, createNote, deleteNote, setPassword } from './note.js'
import { URL } from 'node:url'
import sanitizeHtml from 'sanitize-html'
import he from 'he'

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

app.get('/error', (req: Request, res: Response) => {
    throw new Error("Test exception in a route")
})

function createNoteValidator(req: Request, res: Response, next: NextFunction) {
    if (!req.body || !req.body.note) {
        res.status(400).render('error.html', {
            title: '400',
            content: 'Bad request'
        })
        return
    }
    if (req.body.pass && req.body.pass.trim().length < 8) {
        res.status(400).render('error.html', {
            title: '400',
            content: 'Bad request: Password must be at least 8 characters'
        })
        return
    }
    next()
}
function createNoteSanitizer(req: Request, res: Response, next: NextFunction) {
    // By default is used sanitisation in nunjucks template 
    // but if you want something else here are other solutions
    // Remove all Tags
    // req.body.note = sanitizeHtml(req.body.note, {
    //     allowedTags: [],
    //     allowedAttributes: {}
    // })
    // Replace all Tags
    // req.body.note = he.encode(req.body.note)
    if (!req.body.note.trim()) {
        res.status(400).render('error.html', {
            title: '400',
            content: 'Bad request'
        })
        return
    }
    if (req.body.password) {
        req.body.password = req.body.password.trim()
    }
    next()
}
app.post('/', createNoteValidator, createNoteSanitizer, async (req: Request, res: Response, next: NextFunction) => {
    console.log('POST note:', req.body.note)
    const note = req.body.note
    const password = req.body.password
    if (password) {
        setPassword(password);
    }
    let noteId: UUID
    do {
        noteId = randomUUID()
    } while (await isNoteExist(noteId))
    console.log(`Generated note ID: ${noteId}`)
    await createNote(noteId, note)
    const noteUrl = new URL(`${req.protocol}://${req.host}/note/${noteId}`)
    if (password) {
        noteUrl.searchParams.append('password', 'true');
    }
    res.status(200).render('congratulation.html', {
        noteUrl
    })
})

function getNoteValidator(req: Request, res: Response, next: NextFunction) {
    //TODO: validate noteID. It must be UUID
    if (!req.params || !req.params.noteId) {
        res.status(400).render('error.html', {
            title: '400',
            content: 'Bad request'
        })
        return
    }
    next()
}
app.get('/note/:noteId', getNoteValidator, async (req: Request, res: Response, next: NextFunction) => {
    const noteId = req.params.noteId as UUID
    if (req.query.password === 'true') {
        const noteUrl = new URL(`${req.protocol}://${req.host}/noteWithPassword/${noteId}`)
        res.render('noteWithPassword.html', { noteUrl: noteUrl.pathname });
        return;
    }

    const exist = await isNoteExist(noteId)
    if (!exist) {
        console.log('Note not found')
        res.status(404).render('error.html', {
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


function getNoteWithPasswordValidator(req: Request, res: Response, next: NextFunction) {
    //TODO: validate noteID. It must be UUID
    if (!req.params || !req.params.noteId) {
        res.status(400).render('error.html', {
            title: '400',
            content: 'Bad request'
        })
        return
    }
    if (!req.body || !req.body.password || req.body.password.length < 8) {
        res.status(400).render('error.html', {
            title: '400',
            content: 'Bad request'
        })
        return
    }
    next()
}
app.post('/noteWithPassword/:noteId', getNoteWithPasswordValidator, async (req: Request, res: Response, next: NextFunction) => {
    const noteId = req.params.noteId as UUID
    setPassword(req.body.password)

    const exist = await isNoteExist(noteId)
    if (!exist) {
        console.log('Note not found')
        res.status(404).render('error.html', {
            title: '404',
            content: 'Note not found'
        })
        return
    }
    const note = await getNote(noteId)

    await deleteNote(noteId)
    console.log(`Note ID(${noteId}) with password is removed`)
    console.log(`Note: ${note}`)

    res.render('note.html', { note })
})

app.use(express.static('src/public'))

function errorHandlerMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err)
    res.status(500).render('error.html', {
        title: '500',
        content: 'Server error'
    })
}
app.use(errorHandlerMiddleware)

app.listen(port, () => {
    console.log(`Burn on Read is running on http://localhost:${port}`)
})
