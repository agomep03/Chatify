import config from '../config';
import { handleUnauthorized } from '../utils/auth';

// Mandar un nuevo mensaje, guardarlo en la base de datos y obtener una respuesta de la IA
// Llamada al enpint /chat/{chatId}/message
export type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
};
export const fetchSendMessage = async (
  chatId: string,
  input: string,
  onAddMessage: (msg: Message) => void,
  setLoading: (loading: boolean) => void
) => {
  if (!input.trim()) return;

  const userMessage: Message = {
    id: Date.now(),
    text: input,
    sender: 'user',
  };
  onAddMessage(userMessage);
  setLoading(true);

  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${config.apiBaseUrl}/chat/${chatId}/message`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/plain',
      },
      body: input,
    });
    if (handleUnauthorized(res)) return;

    const data = await res.json();
    const botMessage: Message = {
      id: Date.now() + 1,
      text: data.answer || 'Sin respuesta',
      sender: 'bot',
    };
    onAddMessage(botMessage);
  } catch {
    const errorMessage: Message = {
      id: Date.now() + 1,
      text: 'Error al obtener respuesta.',
      sender: 'bot',
    };
    onAddMessage(errorMessage);
  } finally {
    setLoading(false);
  }
};



// Obtener historial de una conversacion
// Llamada al enpoint /chat/{chatId}/history
export const fetchChatHistory = async (
    chatId: string,
    onSetMessages: (msgs: Message[]) => void,
    setLoading: (loading: boolean) => void
  ) => {
    setLoading(true);
    const token = localStorage.getItem("token");
  
    try {
      const res = await fetch(`${config.apiBaseUrl}/chat/${chatId}/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (handleUnauthorized(res)) return;

      const data = await res.json();
      const historyMessages: Message[] = data.map((msg: any, index: number) => ({
        id: Date.now() + index,
        sender: msg.role === 'user' ? 'user' : 'bot',
        text: msg.content,
      }));
  
      onSetMessages(historyMessages);
    } catch {
      onSetMessages([]);
    } finally {
      setLoading(false);
    }
  };



// Borrar una conversacion
// Llamada al endpoint /chat/{chatId}
export const fetchDeleteChat = async (chatId: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${config.apiBaseUrl}/chat/${chatId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (handleUnauthorized(res)) return;
    if (!res.ok) throw new Error("No se pudo eliminar el chat");
  };



// Comenzar una conversacion
// Llamada al endpoint /chat/start
export const fetchStartChat = async (): Promise<string> => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${config.apiBaseUrl}/chat/start`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (handleUnauthorized(res)) return "";
    const newChat = await res.json();
    if (!res.ok || !newChat.chat_id) {
      throw new Error("Respuesta inválida del servidor");
    }
    return newChat.chat_id.toString();
  };



// Actualizar título del chat
// Llamada al endpoint /chat/{chatId}/rename
export const fetchUpdateChatTitle = async (chatId: string, newTitle: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${config.apiBaseUrl}/chat/${chatId}/rename`, {
      method: "PUT",
      headers: {
        "Content-Type": "text/plain",
        Authorization: `Bearer ${token}`,
      },
      body: newTitle,
    });
    if (handleUnauthorized(res)) return;
    if (!res.ok) throw new Error("Error al actualizar título");
  };



// Obtener todos los chats de un usuario
// Llamada al endpoint /chat/user
export interface Chat {
    id: string;
    title: string;
  }
export const fetchObtainAllChats = async (): Promise<Chat[]> => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${config.apiBaseUrl}/chat/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (handleUnauthorized(res)) return [];
    if (!res.ok) throw new Error("Error al obtener chats");
    const data: Chat[] = await res.json();
    return data;
};


