import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }
    
    // Validate that the URL is from a trusted source
    const trustedDomains = [
      's3.dualstack.us-east-1.amazonaws.com',
      'igv.org',
      'rest.ensembl.org',
      'api.genome.ucsc.edu'
    ];
    
    const urlObj = new URL(url);
    const isTrusted = trustedDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
    );
    
    if (!isTrusted) {
      return NextResponse.json(
        { error: 'URL not from trusted domain' },
        { status: 403 }
      );
    }
    
    console.log(`Proxying request to: ${url}`);
    
    // Fetch the resource and stream it back
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'GeneNFT/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Upstream request failed: ${response.status}`);
    }
    
    // Get the response as a readable stream
    const stream = response.body;
    
    if (!stream) {
      throw new Error('No response body received');
    }
    
    // Create a new response with the stream
    const newResponse = new NextResponse(stream, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
        'Content-Length': response.headers.get('Content-Length') || '',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
    
    return newResponse;
    
  } catch (error) {
    console.error('Error proxying request to IGV:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to proxy request: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to proxy request' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  // Handle CORS preflight requests
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
