import { useEffect, useState } from "react";

export default function StoreProfilePage() {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/stores/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro ao carregar perfil da loja");
        setStore(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={styles.container}>
      {/* Banner */}
      {store.banner && (
        <div style={styles.bannerWrapper}>
          <img src={store.banner} alt="Banner da Loja" style={styles.banner} />
        </div>
      )}

      {/* Logo e informações principais */}
      <div style={styles.header}>
        <img
          src={store.logo || "https://via.placeholder.com/100"}
          alt="Logo da Loja"
          style={styles.logo}
        />
        <div>
          <h1 style={styles.storeName}>{store.name}</h1>
          <p style={styles.status}>
            {store.isApproved ? "Aprovada ✅" : "Aguardando aprovação ⏳"}
          </p>
          {store.description && <p style={styles.description}>{store.description}</p>}
        </div>
      </div>

      {/* Contatos e Endereço */}
      <div style={styles.infoSection}>
        <h3>Informações de Contato</h3>
        <p><b>Email:</b> {store.email}</p>
        {store.phone && <p><b>Telefone:</b> {store.phone}</p>}
        {(store.address?.street || store.address?.city) && (
          <p>
            <b>Endereço:</b>{" "}
            {`${store.address?.street || ""}, ${store.address?.city || ""}, ${store.address?.province || ""}`}
          </p>
        )}
      </div>

      {/* Redes sociais */}
      {(store.social?.facebook || store.social?.instagram || store.social?.whatsapp) && (
        <div style={styles.infoSection}>
          <h3>Redes Sociais</h3>
          {store.social.facebook && <p><b>Facebook:</b> <a href={store.social.facebook} target="_blank">{store.social.facebook}</a></p>}
          {store.social.instagram && <p><b>Instagram:</b> <a href={store.social.instagram} target="_blank">{store.social.instagram}</a></p>}
          {store.social.whatsapp && <p><b>WhatsApp:</b> <a href={`https://wa.me/${store.social.whatsapp}`} target="_blank">{store.social.whatsapp}</a></p>}
        </div>
      )}

      {/* Datas */}
      <p style={styles.createdAt}><b>Criada em:</b> {new Date(store.createdAt).toLocaleDateString()}</p>

      {/* Ações */}
      <div style={styles.actions}>
        <button style={styles.button}>Editar Loja</button>
        <button style={styles.buttonSecondary}>Ver Produtos</button>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "900px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" },
  bannerWrapper: { width: "100%", height: "200px", overflow: "hidden", borderRadius: "10px", marginBottom: "20px" },
  banner: { width: "100%", height: "100%", objectFit: "cover" },
  header: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" },
  logo: { width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "2px solid #ccc" },
  storeName: { margin: "0" },
  status: { fontSize: "14px", color: "#555" },
  description: { marginTop: "10px", fontSize: "16px", color: "#444" },
  infoSection: { marginTop: "20px" },
  createdAt: { marginTop: "20px", fontSize: "14px", color: "#666" },
  actions: { marginTop: "30px", display: "flex", gap: "15px" },
  button: { background: "#007bff", color: "#fff", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" },
  buttonSecondary: { background: "#f5f5f5", color: "#333", padding: "10px 20px", border: "1px solid #ddd", borderRadius: "5px", cursor: "pointer" },
};
