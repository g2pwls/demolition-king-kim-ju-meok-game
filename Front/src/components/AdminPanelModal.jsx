import React, { useEffect, useState } from "react";
import api from "../utils/api";
import "../styles/AdminPanelModal.css";

/** dev(로컬)는 Vite 프록시(/api), prod(배포)는 /openviduback/api */
const ADMIN_BASE = (["localhost", "127.0.0.1"].includes(window.location.hostname))
    ? `${window.location.origin}/api` // 절대 URL로 baseURL 무시 + Vite 프록시 사용
    : `${window.location.origin}/openviduback/api`;

/** 백엔드 prefix (Swagger 기준) */
const ADMIN_PREFIX = "/admin";

/** 공통 요청 헬퍼 (api 인터셉터/토큰 그대로 활용) */
function admin(method, resourcePath, options = {}) {
    // resourcePath는 '/users', '/bug-reports' 처럼 '리소스만' 넘긴다 (⚠ '/api' 금지)
    const url = `${ADMIN_BASE}${ADMIN_PREFIX}${resourcePath}`;
    // console.log("👉 Admin 요청 URL:", url);
    return api.request({ method, url, ...options });
}

export default function AdminPanelModal({ open, onClose }) {
    const [tab, setTab] = useState("users"); // users | purge | bug

    useEffect(() => {
        if (!open) return;
        const onEsc = (e) => e.key === "Escape" && onClose?.();
        document.addEventListener("keydown", onEsc, { once: true });
        return () => document.removeEventListener("keydown", onEsc);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="apm-overlay" onClick={onClose}>
            <div className="apm-card" onClick={(e) => e.stopPropagation()}>
                <div className="apm-header">
                    <div className="apm-tabs">
                        <button className={tab === "users" ? "active" : ""} onClick={() => setTab("users")}>
                            회원 리스트
                        </button>
                        <button className={tab === "purge" ? "active" : ""} onClick={() => setTab("purge")}>
                            회원 강제 추방
                        </button>
                        <button className={tab === "bug" ? "active" : ""} onClick={() => setTab("bug")}>
                            버그 리포트
                        </button>
                    </div>
                    <button className="apm-close" onClick={onClose}>✕</button>
                </div>

                <div className="apm-body">
                    {tab === "users" && <UsersTab />}
                    {tab === "purge" && <PurgeTab />}
                    {tab === "bug" && <BugTab />}
                </div>
            </div>
        </div>
    );
}

/* 1) 회원 리스트 탭 */
function UsersTab() {
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const { data } = await admin("get", "/users", {
                params: { keyword: keyword || undefined, page, size },
            });
            setData(data);
        } catch {
            alert("회원 조회 실패");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load(); // 초기/페이지 변경
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, size]);

    const search = () => { setPage(0); load(); };

    const kick = async (uuid) => {
        if (!window.confirm(`정말 강퇴할까요?\n${uuid}`)) return;
        try {
            await admin("delete", `/users/${uuid}`);
            load();
        } catch {
            alert("강퇴 실패");
        }
    };

    return (
        <>
            <div className="apm-controls">
                <input
                    className="apm-input"
                    placeholder="이메일/닉네임 검색"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && search()}
                />
                <button className="apm-btn" onClick={search}>검색</button>
                <select className="apm-select" value={size} onChange={(e) => setSize(Number(e.target.value))}>
                    <option value={10}>10개</option>
                    <option value={20}>20개</option>
                    <option value={50}>50개</option>
                </select>
            </div>

            {loading ? (
                <div className="apm-empty">불러오는 중…</div>
            ) : !data || data.empty ? (
                <div className="apm-empty">데이터 없음</div>
            ) : (
                <>
                    <table className="apm-table">
                        <thead>
                        <tr>
                            <th>UUID</th><th>이메일</th><th>닉네임</th><th>가입일</th><th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.content.map((u) => (
                            <tr key={u.userUuid}>
                                <td className="mono">{u.userUuid}</td>
                                <td>{u.userEmail}</td>
                                <td>{u.userNickname}</td>
                                <td>{new Date(u.createdAt).toLocaleString()}</td>
                                <td><button className="apm-danger" onClick={() => kick(u.userUuid)}>강퇴</button></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="apm-pager">
                        <button className="apm-ghost" disabled={data.first} onClick={() => setPage((p) => Math.max(0, p - 1))}>이전</button>
                        <span>{(data.number ?? 0) + 1} / {data.totalPages || 1}</span>
                        <button className="apm-ghost" disabled={data.last} onClick={() => setPage((p) => p + 1)}>다음</button>
                    </div>
                </>
            )}
        </>
    );
}

/* 2) 회원 강제 추방 탭 */
function PurgeTab() {
    const [uuid, setUuid] = useState("");
    const purge = async () => {
        const id = uuid.trim();
        if (!id) return alert("UUID를 입력하세요.");
        if (!window.confirm(`정말 강퇴할까요?\n${id}`)) return;
        try {
            await admin("delete", `/users/${id}`);
            alert("강퇴 완료");
            setUuid("");
        } catch {
            alert("강퇴 실패");
        }
    };

    return (
        <div className="apm-form">
            <label>유저 UUID</label>
            <input
                className="apm-input mono"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={uuid}
                onChange={(e) => setUuid(e.target.value)}
            />
            <button className="apm-danger" onClick={purge}>강퇴</button>
        </div>
    );
}

/* 3) 버그 리포트 탭 (작성 + 목록) */
function BugTab() {
    const [content, setContent] = useState("");
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [list, setList] = useState(null);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const { data } = await admin("get", "/bug-reports", {
                params: { page, size },
            });
            setList(data);
        } catch {
            alert("버그 리포트 조회 실패");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, size]);

    const submit = async () => {
        const text = content.trim();
        if (!text) return alert("내용을 입력하세요.");
        try {
            await admin("post", "/bug-reports", { data: { content: text } });
            setContent("");
            load();
        } catch {
            alert("등록 실패");
        }
    };

    return (
        <>
            <div className="apm-form">
                <label>내용</label>
                <textarea
                    className="apm-textarea"
                    rows={4}
                    placeholder="버그 내용을 입력하세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button className="apm-btn" onClick={submit}>등록</button>
            </div>

            <div className="apm-controls">
                <span style={{ opacity: 0.8 }}>페이지 크기:</span>
                <select className="apm-select" value={size} onChange={(e) => setSize(Number(e.target.value))}>
                    <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
                </select>
            </div>

            {loading ? (
                <div className="apm-empty">불러오는 중…</div>
            ) : !list || list.empty ? (
                <div className="apm-empty">리포트 없음</div>
            ) : (
                <>
                    <table className="apm-table">
                        <thead>
                        <tr>
                            <th>#</th><th>작성자 UUID</th><th>내용</th><th>작성일</th>
                        </tr>
                        </thead>
                        <tbody>
                        {list.content.map((r) => (
                            <tr key={r.bugReportSeq}>
                                <td>{r.bugReportSeq}</td>
                                <td className="mono">{r.userUuid}</td>
                                <td style={{ whiteSpace: "pre-wrap" }}>{r.content}</td>
                                <td>{new Date(r.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="apm-pager">
                        <button className="apm-ghost" disabled={list.first} onClick={() => setPage((p) => Math.max(0, p - 1))}>이전</button>
                        <span>{(list.number ?? 0) + 1} / {list.totalPages || 1}</span>
                        <button className="apm-ghost" disabled={list.last} onClick={() => setPage((p) => p + 1)}>다음</button>
                    </div>
                </>
            )}
        </>
    );
}
