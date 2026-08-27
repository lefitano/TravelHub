import { useRef, useState } from "react"

const API_KEY = import.meta.env.VITE_GEOAPIFY_KEY

// Campo de destino com sugestões via Geoapify (busca-enquanto-digita).
// Se não houver chave configurada (ou a API falhar), continua funcionando
// como um input de texto livre normal — nunca trava a experiência do usuário.
export default function DestinoAutocomplete({ value, onChange, placeholder = "Destino", required = false, style, className }) {
    const [sugestoes, setSugestoes] = useState([])
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false)
    const debounceRef = useRef(null)

    function handleChange(e) {
        const texto = e.target.value
        onChange(texto)

        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }

        if (!API_KEY || texto.trim().length < 3) {
            setSugestoes([])
            return
        }

        debounceRef.current = setTimeout(async () => {
            try {
                const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(texto)}&limit=5&apiKey=${API_KEY}`
                const res = await fetch(url)
                const data = await res.json()
                setSugestoes(data.features || [])
                setMostrarSugestoes(true)
            } catch {
                setSugestoes([])
            }
        }, 400)
    }

    function handleSelecionar(sugestao) {
        onChange(sugestao.properties.formatted)
        setSugestoes([])
        setMostrarSugestoes(false)
    }

    return (
        <div style={{ position: "relative" }}>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                onFocus={() => sugestoes.length > 0 && setMostrarSugestoes(true)}
                onBlur={() => setTimeout(() => setMostrarSugestoes(false), 150)}
                required={required}
                style={style}
                className={className}
            />
            {mostrarSugestoes && sugestoes.length > 0 && (
                <ul style={{
                    position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10,
                    backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px",
                    marginTop: "0.25rem", padding: "0.25rem 0", listStyle: "none",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.1)", maxHeight: "220px", overflowY: "auto"
                }}>
                    {sugestoes.map(s => (
                        <li
                            key={s.properties.place_id}
                            onMouseDown={() => handleSelecionar(s)}
                            style={{ padding: "0.5rem 0.75rem", cursor: "pointer", fontSize: "0.9rem" }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#fff4ef" }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent" }}
                        >
                            {s.properties.formatted}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
