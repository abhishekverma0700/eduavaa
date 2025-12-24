import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

/* 🔐 SAME UID AS BACKEND */
const ADMIN_UID = "ixvHHm1c9Qh3ZrrCn8j20tl4DYb2";

interface Sale {
  name: string;
  email: string;
  note_path: string;
  payment_id: string;
  created_at: string;
}

const AdminPage = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ❌ Not logged in */
  if (!user) {
    return <Navigate to="/" replace />;
  }

  /* ❌ Not admin (UID check) */
  if (user.uid !== ADMIN_UID) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/sales`, {
          headers: {
            "Content-Type": "application/json",
            "x-admin-uid": user.uid, // 🔑 REQUIRED BY BACKEND
          },
        });

        if (!res.ok) {
          const bodyText = await res.text();
          throw new Error(bodyText || `Request failed with ${res.status}`);
        }

        const data = await res.json();
        setSales(data.sales || []);
      } catch (err) {
        console.error("Failed to load sales", err);
        setError("Failed to load admin data. Please retry in a moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [user.uid]);

  return (
    <Layout title="Admin Panel – Eduava">
      <div className="container py-12">
        <h1 className="text-3xl font-serif font-bold mb-2">
          Admin Panel
        </h1>
        <p className="text-muted-foreground mb-8">
          Sales & unlocked notes overview
        </p>

        {loading ? (
          <p>Loading sales…</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : sales.length === 0 ? (
          <p>No sales yet.</p>
        ) : (
          <div className="overflow-x-auto border rounded-xl">
            <table className="min-w-full text-sm">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Note</th>
                  <th className="px-4 py-3 text-left">Payment ID</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s, i) => (
                  <tr
                    key={i}
                    className="border-t hover:bg-secondary/40"
                  >
                    <td className="px-4 py-3">{s.name}</td>
                    <td className="px-4 py-3">{s.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">
                        {s.note_path.split("/").pop()}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {s.payment_id}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {new Date(s.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminPage;
