import urllib.request
import json

real_samples = [
    [5400, 620, 840, 1, 1, 5.2, 620, 45, 4, 4, 1, 1, 'Real'],
    [3200, 480, 520, 1, 0, 4.1, 410, 38, 3, 5, 1, 1, 'Real'],
    [8900, 760, 1200, 1, 1, 6.3, 950, 72, 5, 6, 2, 1, 'Real'],
    [4500, 390, 600, 1, 0, 3.7, 510, 41, 4, 5, 1, 1, 'Real'],
    [7200, 540, 950, 1, 0, 4.8, 700, 60, 3, 3, 0, 1, 'Real'],
    [2600, 310, 410, 1, 0, 2.9, 300, 20, 2, 4, 0, 0, 'Real'],
    [11000, 980, 840, 1, 1, 7.5, 1200, 95, 4, 4, 3, 1, 'Real'],
    [3900, 520, 730, 1, 0, 5.1, 430, 36, 5, 6, 1, 0, 'Real'],
    [2800, 400, 510, 1, 0, 3.4, 290, 18, 3, 3, 0, 0, 'Real'],
    [6100, 650, 880, 1, 1, 6.8, 720, 57, 4, 5, 1, 1, 'Real'],
    [4700, 580, 760, 1, 0, 4.3, 530, 42, 4, 4, 1, 1, 'Real'],
    [8300, 790, 1150, 1, 1, 6.5, 980, 83, 5, 5, 2, 1, 'Real'],
    [3500, 420, 620, 1, 0, 3.9, 390, 28, 3, 4, 0, 0, 'Real'],
    [5100, 610, 790, 1, 0, 5.4, 610, 48, 4, 5, 1, 1, 'Real'],
    [6800, 720, 980, 1, 1, 6.1, 810, 66, 5, 4, 2, 1, 'Real']
]

fake_samples = [
    [25, 4500, 40, 0, 0, 0.1, 0, 0, 35, 35, 40, 5, 'Fake'],
    [40, 5200, 55, 0, 0, 0.2, 1, 0, 42, 32, 50, 4, 'Fake'],
    [18, 3800, 22, 0, 0, 0.1, 0, 0, 28, 30, 35, 5, 'Fake'],
    [60, 6100, 70, 0, 0, 0.3, 1, 0, 45, 28, 55, 4, 'Fake'],
    [35, 4700, 35, 0, 0, 0.2, 0, 0, 40, 34, 42, 5, 'Fake'],
    [50, 7200, 80, 0, 0, 0.4, 2, 0, 50, 36, 60, 5, 'Fake'],
    [22, 3300, 18, 0, 0, 0.1, 0, 0, 25, 25, 28, 4, 'Fake'],
    [75, 8500, 95, 0, 0, 0.5, 2, 0, 55, 40, 65, 5, 'Fake'],
    [30, 4200, 28, 0, 0, 0.2, 0, 0, 38, 31, 44, 4, 'Fake'],
    [55, 5600, 60, 0, 0, 0.3, 1, 0, 48, 29, 52, 5, 'Fake'],
    [15, 2900, 12, 0, 0, 0.1, 0, 0, 20, 22, 24, 4, 'Fake'],
    [80, 9100, 110, 0, 0, 0.6, 3, 0, 60, 42, 70, 5, 'Fake'],
    [45, 6400, 48, 0, 0, 0.3, 1, 0, 46, 33, 58, 4, 'Fake'],
    [28, 3700, 20, 0, 0, 0.2, 0, 0, 30, 27, 32, 5, 'Fake'],
    [65, 7800, 85, 0, 0, 0.4, 2, 0, 58, 39, 68, 5, 'Fake']
]

all_samples = real_samples + fake_samples
results = []
correct = 0

for i, row in enumerate(all_samples):
    data = {
        'Followers': row[0],
        'Following': row[1],
        'Posts': row[2],
        'Profile_Pic': row[3],
        'Verified': row[4],
        'Account_Age': row[5],
        'Avg_Likes': row[6],
        'Avg_Comments': row[7],
        'Posts_Per_Week': row[8],
        'Avg_Hashtags': row[9],
        'Posts_With_Links': row[10],
        'Links_In_Bio': row[11]
    }
    expected = row[12]
    
    req = urllib.request.Request('http://127.0.0.1:8000/predict', 
                                 data=json.dumps(data).encode('utf-8'),
                                 headers={'Content-Type': 'application/json'},
                                 method='POST')
    
    try:
        with urllib.request.urlopen(req) as response:
            resp_data = json.loads(response.read().decode('utf-8'))
            prediction = resp_data['prediction']
            confidence = resp_data['confidence_score']
            is_correct = prediction == expected
            if is_correct:
                correct += 1
            status = 'PASSED' if is_correct else 'FAILED'
            results.append(f'Test {i+1} ({expected}): Predicted {prediction} ({confidence}%) -> {status}')
    except Exception as e:
        results.append(f'Test {i+1} ({expected}): Error - {e}')

print('--- TEST RESULTS ---')
for res in results:
    print(res)
print(f'\\nTotal Accuracy: {correct}/{len(all_samples)} ({(correct/len(all_samples))*100:.1f}%)')
