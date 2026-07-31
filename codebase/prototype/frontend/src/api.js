// Backend runs on 8020 in this dev environment (port 8000 has a persistent
// Windows stale-socket issue on this machine -- see backend PHASE2_NOTES.md).
export const API_BASE = 'http://localhost:8020'

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`${options?.method || 'GET'} ${path} failed: ${res.status} ${text}`)
  }
  return res.json()
}

export function createSession(answers) {
  return request('/session', { method: 'POST', body: JSON.stringify(answers) })
}

export function listPdfs() {
  return request('/pdfs')
}

export function ingestPdf(pdfFilename) {
  return request('/ingest', { method: 'POST', body: JSON.stringify({ pdf_filename: pdfFilename }) })
}

export function getSummary(documentId, refresh = false) {
  return request(`/summary/${documentId}${refresh ? '?refresh=true' : ''}`)
}

export function explain({ documentId, sessionId, mode, nodeId, pageNumber, selectedText, userQuestion, chatHistory }) {
  return request('/explain', {
    method: 'POST',
    body: JSON.stringify({
      document_id: documentId,
      session_id: sessionId,
      mode,
      node_id: nodeId,
      page_number: pageNumber,
      selected_text: selectedText,
      user_question: userQuestion,
      chat_history: chatHistory,
    }),
  })
}

export function createQuiz({ documentId, sessionId, userRequest, numQuestions }) {
  return request('/quiz', {
    method: 'POST',
    body: JSON.stringify({
      document_id: documentId,
      session_id: sessionId,
      user_request: userRequest,
      num_questions: numQuestions,
    }),
  })
}

export function pdfUrl(documentId) {
  return `${API_BASE}/pdf/${documentId}`
}
