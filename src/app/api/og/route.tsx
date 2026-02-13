import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const name = searchParams.get('name') || 'Professor';
    const dept = searchParams.get('dept') || 'Department';
    const rating = searchParams.get('rating') || '0';
    const count = searchParams.get('count') || '0';
    const designation = searchParams.get('designation') || '';

    const ratingNum = parseFloat(rating);
    const countNum = parseInt(count);

    const ratingColor = ratingNum >= 4 ? '#10b981' : ratingNum >= 3 ? '#eab308' : ratingNum >= 2 ? '#f97316' : '#64748b';

    const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    position: 'relative',
                }}
            >
                {/* Decorative circles */}
                <div style={{
                    position: 'absolute', top: '-50px', left: '-50px',
                    width: '300px', height: '300px', borderRadius: '50%',
                    background: 'rgba(56, 189, 248, 0.1)',
                    display: 'flex',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-80px', right: '-80px',
                    width: '400px', height: '400px', borderRadius: '50%',
                    background: 'rgba(139, 92, 246, 0.1)',
                    display: 'flex',
                }} />

                {/* Content card */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '48px 64px',
                    borderRadius: '24px',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    background: 'rgba(30, 41, 59, 0.8)',
                    maxWidth: '900px',
                }}>
                    {/* Avatar */}
                    <div style={{
                        width: '100px', height: '100px', borderRadius: '24px',
                        background: 'linear-gradient(135deg, #38bdf8, #3b82f6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '24px',
                        boxShadow: '0 8px 32px rgba(56, 189, 248, 0.3)',
                    }}>
                        <span style={{ color: 'white', fontSize: '40px', fontWeight: 700 }}>{initials}</span>
                    </div>

                    {/* Name */}
                    <h1 style={{
                        color: 'white', fontSize: '48px', fontWeight: 700,
                        margin: '0 0 8px 0', textAlign: 'center',
                        lineHeight: 1.1,
                    }}>{name}</h1>

                    {/* Designation & Department */}
                    <p style={{ color: '#94a3b8', fontSize: '22px', margin: '0 0 4px 0' }}>{designation}</p>
                    <p style={{ color: '#38bdf8', fontSize: '24px', fontWeight: 600, margin: '0 0 32px 0' }}>{dept}</p>

                    {/* Rating */}
                    {countNum > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <div style={{
                                width: '80px', height: '80px', borderRadius: '16px',
                                background: ratingColor,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: `0 8px 24px ${ratingColor}40`,
                            }}>
                                <span style={{ color: 'white', fontSize: '36px', fontWeight: 700 }}>{rating}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ color: 'white', fontSize: '28px', fontWeight: 600 }}>/ 5.0</span>
                                <span style={{ color: '#94a3b8', fontSize: '18px' }}>{count} reviews</span>
                            </div>
                        </div>
                    ) : (
                        <p style={{ color: '#64748b', fontSize: '20px' }}>No reviews yet — be the first!</p>
                    )}
                </div>

                {/* Branding */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    position: 'absolute', bottom: '24px', right: '32px',
                }}>
                    <span style={{ color: '#64748b', fontSize: '18px' }}>RateDeezAir</span>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
